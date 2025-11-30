import { action, computed, observable } from 'mobx';

import BackgroundState from './BackgroundState';
import EggState from './EggState';
import GearState from './GearState';
import HabiticaAPI from './HabiticaAPI';
import HatchingPotionState from './HatchingPotionState';
import PetState from './PetState';
import QuestState from './QuestState';
import UserState from './UserState';

class AppStore {
  @observable accessor loadingobjects = true;

  quests = observable.map(new Map());
  pets = observable.map(new Map());
  basepets = observable.map(new Map());
  premiumpets = observable.map(new Map());
  premiumhatchingpotions = observable.map(new Map());
  gear = observable.map(new Map());
  backgrounds = observable.map(new Map());

  @observable accessor eggs = {
    categories: ['base', 'quest'],
    base: observable.map(new Map()),
    quest: observable.map(new Map())
  };

  @observable accessor users = [];
  @observable accessor infoUser = [];

  loadParty = false;
  @observable accessor menupage = 'petsquesteggs';

  api = undefined;

  @action gotoPetsQuestEggs() {
    this.menupage = 'petsquesteggs';
  }

  @action gotoBasePets() {
    this.menupage = 'basepets';
  }

  @action gotoPremiumPets() {
    this.menupage = 'premiumpets';
  }

  @action gotoOtherQuests() {
    this.menupage = 'otherquests';
  }

  @action gotoGear() {
    this.menupage = 'gear';
  }

  @action gotoBackgrounds() {
    this.menupage = 'backgrounds';
  }

  @action gotoAbout() {
    this.menupage = 'about';
  }

  constructor() {
    this.api = new HabiticaAPI();

    this.fetchCommonObjects();
  }

  @action fetchCommonObjects() {
    this.api.getContent()
      .then(action(json => {
        const quests = new Map();
        new Map(Object.entries(json.data.quests)).forEach(function (value, key) {
          quests.set(key, new QuestState(key, value, this));
        }, this);
        this.quests.merge(quests);

        const pets = new Map();
        new Map(Object.entries(json.data.questPets)).forEach(function (value, key) {
          pets.set(key, new PetState(key, this));
        }, this);
        this.pets.merge(pets);

        const basepets = new Map();
        new Map(Object.entries(json.data.pets)).forEach(function (value, key) {
          basepets.set(key, new PetState(key, this));
        }, this);
        this.basepets.merge(basepets);

        const premiumpets = new Map();
        new Map(Object.entries(json.data.premiumPets)).forEach(function (value, key) {
          premiumpets.set(key, new PetState(key, this));
        }, this);
        this.premiumpets.merge(premiumpets);

        const premiumhatchingpotions = new Map();
        new Map(Object.entries(json.data.premiumHatchingPotions)).forEach(function (value, key) {
          premiumhatchingpotions.set(key, new HatchingPotionState(key, value, this));
        }, this);
        this.premiumhatchingpotions.merge(premiumhatchingpotions);

        const baseEggs = new Map();
        const questEggs = new Map();
        const questEggKeys = new Map(Object.entries(json.data.questEggs));

        new Map(Object.entries(json.data.eggs)).forEach(function (value, key) {
          let egg = new EggState(value);
          if (questEggKeys.has(key)) questEggs.set(key, egg);
          else baseEggs.set(key, egg);
        }, this);
        this.eggs.base.merge(baseEggs);
        this.eggs.quest.merge(questEggs);

        const gear = new Map();
        new Map(Object.entries(json.data.gear.flat)).forEach(function (value, key) {
          gear.set(key, new GearState(key, value, this));
        }, this);
        this.gear.merge(gear);

        const backgrounds = new Map();
        new Map(Object.entries(json.data.backgroundsFlat)).forEach(function (value, key) {
          backgrounds.set(key, new BackgroundState(key, value, this));
        }, this);
        this.backgrounds.merge(backgrounds);

        this.loadingobjects = false;
        this.loadQueryString();
      }))
  }

  @action reloadUsers() {
    this.users.clear();
    this.loadQueryString();
  }

  @action loadQueryString() {
    let queryParty = this.getQueryVariable('party');
    if (queryParty !== null) {
      this.loadParty = true;
      this.addParty();
    }

    let queryStringUsers = this.getQueryVariable('users');
    if (queryStringUsers !== null) {
      queryStringUsers = decodeURIComponent(queryStringUsers);
      queryStringUsers.split('|').forEach(function (val, index) {
        this.addUser(val);
      }, this)
    }
  }

  @action addUser(userid) {
    if (userid !== '' && !this.userExists(userid)) {
      this.users.push(new UserState(this, userid));
      this.setQueryVariable();
    }
  }

  @action async addParty() {
    this.api.getPartyMembers()
      .then(json => json.data.map(member => member._id))
      .then(members => {
        this.loadParty = false;
        members.forEach(user => this.addUser(user));
      })
      .catch(err => {});
  }

  userExists(userid) {
    return this.users.map(u => u.id).filter(u => u === userid).length > 0;
  }

  @action removeUser(user) {
    this.users.remove(user);

    // also remove it from quests
    this.quests.forEach(function (value, key, map) {
      value.removeUser(user);
    });

    // also remove it from pets
    this.pets.forEach(function (value, key, map) {
      value.removeUser(user);
    });
    this.basepets.forEach(function (value, key, map) {
      value.removeUser(user);
    });
    this.premiumpets.forEach(function (value, key, map) {
      value.removeUser(user);
    });
    this.premiumhatchingpotions.forEach(function (value, key, map) {
      value.removeUser(user);
    });

    // also remove it from eggs
    for (let category of this.eggs.categories) {
      this.eggs[category].forEach(function (egg) {
        egg.removeUser(user);
      });
    }

    // also remove it from gear
    this.gear.forEach(function (value, key, map) {
      value.removeUser(user);
    });

    this.setQueryVariable();
  }

  @action addInfoUser(user) {
    this.infoUser.push(user);
  }

  @action removeInfoUser(user) {
    this.infoUser.remove(user);
  }

  countValidUsers() {
    return this.users.reduce((prevVal, u) => prevVal + (u.loading || u.invalid ? 0 : 1), 0);
  }

  @computed get petCategories() {
    let categories = new Set();
    let pets = [...this.pets].map(([id, pet]) => pet)

    for (let pet of pets) {
      categories.add(pet.basetype);
    }
    return categories;
  }

  @computed get basepetCategories() {
    let categories = new Set();
    let pets = [...this.basepets].map(([id, pet]) => pet)

    for (let pet of pets) {
      categories.add(pet.basetype);
    }
    return categories;
  }

  @computed get premiumpetCategories() {
    let categories = new Set();
    let pets = [...this.premiumpets].map(([id, pet]) => pet)

    for (let pet of pets) {
      categories.add(pet.basetype);
    }
    return categories;
  }

  @computed get premiumhatchingpotionCategories() {
    let categories = new Set();
    let potions = [...this.premiumhatchingpotions].map(([id, potion]) => potion)

    for (let potion of potions) {
      categories.add(potion.id);
    }
    return categories;
  }

  @computed get totalNeededPetsParty() {
    return [...this.pets].map(([id, pet]) => pet)
      .reduce((prevVal, pet) => prevVal + pet.needed, 0);
  }

  @computed get totalCountPetsParty() {
    return [...this.pets].map(([id, pet]) => pet)
      .reduce((prevVal, pet) => prevVal + pet.count, 0);
  }

  @computed get totalCountPets() {
    return ([...this.pets].length * 2) * this.countValidUsers();
  }

  @computed get totalNeededBasePetsParty() {
    return [...this.basepets].map(([id, pet]) => pet)
      .reduce((prevVal, pet) => prevVal + pet.needed, 0);
  }

  @computed get totalCountBasePetsParty() {
    return [...this.basepets].map(([id, pet]) => pet)
      .reduce((prevVal, pet) => prevVal + pet.count, 0);
  }

  @computed get totalCountBasePets() {
    return ([...this.basepets].length * 2) * this.countValidUsers();
  }

  @computed get totalNeededPremiumPetsParty() {
    return [...this.premiumpets].map(([id, pet]) => pet)
      .reduce((prevVal, pet) => prevVal + pet.needed, 0);
  }

  @computed get totalCountPremiumPetsParty() {
    return [...this.premiumpets].map(([id, pet]) => pet)
      .reduce((prevVal, pet) => prevVal + pet.count, 0);
  }

  @computed get totalCountPremiumPets() {
    return ([...this.premiumpets].length * 2) * this.countValidUsers();
  }

  @computed get gearleaderboard() {
    return this.users.slice().sort(function (a, b) {
      if (a.totalGearCount > b.totalGearCount) {
        return -1;
      }
      if (a.totalGearCount < b.totalGearCount) {
        return 1;
      }
    });
  }

  @computed get top3gearleaderboard() {
    if (this.gearleaderboard.length >= 2) {
      return this.gearleaderboard.slice(0, 3);
    }
    else {
      return this.gearleaderboard;
    }
  }

  @computed get petleaderboard() {
    return this.users.slice().sort(function (a, b) {
      if (a.totalPetCount > b.totalPetCount) {
        return -1;
      }
      if (a.totalPetCount < b.totalPetCount) {
        return 1;
      }
    });
  }

  @computed get top3petleaderboard() {
    if (this.petleaderboard.length >= 2) {
      return this.petleaderboard.slice(0, 3);
    }
    else {
      return this.petleaderboard;
    }
  }

  @computed get basepetleaderboard() {
    return this.users.slice().sort(function (a, b) {
      if (a.totalBasePetCount > b.totalBasePetCount) {
        return -1;
      }
      if (a.totalBasePetCount < b.totalBasePetCount) {
        return 1;
      }
    });
  }

  @computed get top3basepetleaderboard() {
    if (this.basepetleaderboard.length >= 2) {
      return this.basepetleaderboard.slice(0, 3);
    }
    else {
      return this.basepetleaderboard;
    }
  }


  @computed get premiumpetleaderboard() {
    return this.users.slice().sort(function (a, b) {
      if (a.totalPremiumPetCount > b.totalPremiumPetCount) {
        return -1;
      }
      if (a.totalPremiumPetCount < b.totalPremiumPetCount) {
        return 1;
      }
    });
  }

  @computed get top3premiumpetleaderboard() {
    if (this.premiumpetleaderboard.length >= 2) {
      return this.premiumpetleaderboard.slice(0, 3);
    }
    else {
      return this.premiumpetleaderboard;
    }
  }

  @computed get userQueryString() {
    return this.users.map(user => user.id).join('|');
  }

  setQueryVariable = function () {
    let userQueryString = this.userQueryString;

    let searchParams = [];
    if (this.loadParty) searchParams.push('party=true');
    if (userQueryString !== '') searchParams.push('users=' + this.userQueryString);

    history.pushState(userQueryString, '', '?' + searchParams.join('&'));
  }

  getQueryVariable = function (variable) {
    let urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(variable);
  }

}

export default AppStore;