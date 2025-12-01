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
    quest: observable.map(new Map()),
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
      .then(action((json) => {
        const quests = new Map();
        new Map(Object.entries(json.data.quests)).forEach((value, key) => {
          quests.set(key, new QuestState(key, value, this));
        }, this);
        this.quests.merge(quests);

        const pets = new Map();
        new Map(Object.entries(json.data.questPets)).forEach((value, key) => {
          pets.set(key, new PetState(key, this));
        }, this);
        this.pets.merge(pets);

        const basepets = new Map();
        new Map(Object.entries(json.data.pets)).forEach((value, key) => {
          basepets.set(key, new PetState(key, this));
        }, this);
        this.basepets.merge(basepets);

        const premiumpets = new Map();
        new Map(Object.entries(json.data.premiumPets)).forEach((value, key) => {
          premiumpets.set(key, new PetState(key, this));
        }, this);
        this.premiumpets.merge(premiumpets);

        const premiumhatchingpotions = new Map();
        new Map(Object.entries(json.data.premiumHatchingPotions)).forEach((value, key) => {
          premiumhatchingpotions.set(key, new HatchingPotionState(key, value, this));
        }, this);
        this.premiumhatchingpotions.merge(premiumhatchingpotions);

        const baseEggs = new Map();
        const questEggs = new Map();
        const questEggKeys = new Map(Object.entries(json.data.questEggs));

        new Map(Object.entries(json.data.eggs)).forEach((value, key) => {
          const egg = new EggState(value);
          if (questEggKeys.has(key)) questEggs.set(key, egg);
          else baseEggs.set(key, egg);
        }, this);
        this.eggs.base.merge(baseEggs);
        this.eggs.quest.merge(questEggs);

        const gear = new Map();
        new Map(Object.entries(json.data.gear.flat)).forEach((value, key) => {
          gear.set(key, new GearState(key, value, this));
        }, this);
        this.gear.merge(gear);

        const backgrounds = new Map();
        new Map(Object.entries(json.data.backgroundsFlat)).forEach((value, key) => {
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
    const queryParty = AppStore.getQueryVariable('party');
    if (queryParty !== null) {
      this.loadParty = true;
      this.addParty();
    }

    let queryStringUsers = AppStore.getQueryVariable('users');
    if (queryStringUsers !== null) {
      queryStringUsers = decodeURIComponent(queryStringUsers);
      queryStringUsers.split('|').forEach((val, index) => {
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
      // eslint-disable-next-line no-underscore-dangle
      .then((json) => json.data.map((member) => member._id))
      .then((members) => {
        this.loadParty = false;
        members.forEach((user) => this.addUser(user));
      })
      .catch((err) => {});
  }

  userExists(userid) {
    return this.users.map((u) => u.id).filter((u) => u === userid).length > 0;
  }

  @action removeUser(user) {
    this.users.remove(user);

    // also remove it from quests
    this.quests.forEach((value, key, map) => {
      value.removeUser(user);
    });

    // also remove it from pets
    this.pets.forEach((value, key, map) => {
      value.removeUser(user);
    });
    this.basepets.forEach((value, key, map) => {
      value.removeUser(user);
    });
    this.premiumpets.forEach((value, key, map) => {
      value.removeUser(user);
    });
    this.premiumhatchingpotions.forEach((value, key, map) => {
      value.removeUser(user);
    });

    // also remove it from eggs
    this.eggs.categories.forEach((category) => {
      this.eggs[category].forEach((egg) => {
        egg.removeUser(user);
      });
    });

    // also remove it from gear
    this.gear.forEach((value, key, map) => {
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
    const categories = new Set();
    const pets = [...this.pets].map(([id, pet]) => pet)

    pets.forEach((pet) => {
      categories.add(pet.basetype);
    });
    return categories;
  }

  @computed get basepetCategories() {
    const categories = new Set();
    const pets = [...this.basepets].map(([id, pet]) => pet)

    pets.forEach((pet) => {
      categories.add(pet.basetype);
    });
    return categories;
  }

  @computed get premiumpetCategories() {
    const categories = new Set();
    const pets = [...this.premiumpets].map(([id, pet]) => pet)

    pets.forEach((pet) => {
      categories.add(pet.basetype);
    });
    return categories;
  }

  @computed get premiumhatchingpotionCategories() {
    const categories = new Set();
    const potions = [...this.premiumhatchingpotions].map(([id, potion]) => potion)

    potions.forEach((potion) => {
      categories.add(potion.id);
    });
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
    return this.users.slice().sort((a, b) => {
      if (a.totalGearCount > b.totalGearCount) {
        return -1;
      }
      if (a.totalGearCount < b.totalGearCount) {
        return 1;
      }
      return 0;
    });
  }

  @computed get top3gearleaderboard() {
    return this.gearleaderboard.slice(0, 3);
  }

  @computed get petleaderboard() {
    return this.users.slice().sort((a, b) => {
      if (a.totalPetCount > b.totalPetCount) {
        return -1;
      }
      if (a.totalPetCount < b.totalPetCount) {
        return 1;
      }
      return 0;
    });
  }

  @computed get top3petleaderboard() {
    return this.petleaderboard.slice(0, 3);
  }

  @computed get basepetleaderboard() {
    return this.users.slice().sort((a, b) => {
      if (a.totalBasePetCount > b.totalBasePetCount) {
        return -1;
      }
      if (a.totalBasePetCount < b.totalBasePetCount) {
        return 1;
      }
      return 0;
    });
  }

  @computed get top3basepetleaderboard() {
    return this.basepetleaderboard.slice(0, 3);
  }

  @computed get premiumpetleaderboard() {
    return this.users.slice().sort((a, b) => {
      if (a.totalPremiumPetCount > b.totalPremiumPetCount) {
        return -1;
      }
      if (a.totalPremiumPetCount < b.totalPremiumPetCount) {
        return 1;
      }
      return 0;
    });
  }

  @computed get top3premiumpetleaderboard() {
    return this.premiumpetleaderboard.slice(0, 3);
  }

  @computed get userQueryString() {
    return this.users.map((user) => user.id).join('|');
  }

  setQueryVariable = () => {
    const { userQueryString } = this;

    const searchParams = [];
    if (this.loadParty) searchParams.push('party=true');
    if (userQueryString !== '') searchParams.push('users=' + this.userQueryString);

    window.history.pushState(userQueryString, '', '?' + searchParams.join('&'));
  }

  static getQueryVariable = (variable) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(variable);
  }
}

export default AppStore;
