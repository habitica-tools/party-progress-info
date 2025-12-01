import { action, computed, observable } from 'mobx';

import HabiticaAPI from './HabiticaAPI';

import BackgroundState from './BackgroundState';
import EggState from './EggState';
import GearState from './GearState';
import PetState from './PetState';
import PotionState from './PotionState';
import QuestState from './QuestState';
import UserState from './UserState';

class AppStore {
  @observable accessor loadingobjects = true;

  quests = observable.map(new Map());
  pets = observable.map(new Map());
  basepets = observable.map(new Map());
  premiumpets = observable.map(new Map());
  gear = observable.map(new Map());
  backgrounds = observable.map(new Map());

  @observable accessor eggs = {
    categories: ['base', 'quest'],
    base: observable.map(new Map()),
    quest: observable.map(new Map()),
  };

  @observable accessor potions = {
    categories: ['base', 'premium', 'wacky'],
    base: observable.map(new Map()),
    premium: observable.map(new Map()),
    wacky: observable.map(new Map()),
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
        Object.entries(json.data.quests).forEach(([key, value]) => {
          quests.set(key, new QuestState(value));
        });
        this.quests.merge(quests);

        const pets = new Map();
        Object.entries(json.data.questPets).forEach(([key, value]) => {
          pets.set(key, new PetState(key, this));
        }, this);
        this.pets.merge(pets);

        const basepets = new Map();
        Object.entries(json.data.pets).forEach(([key, value]) => {
          basepets.set(key, new PetState(key, this));
        }, this);
        this.basepets.merge(basepets);

        const premiumpets = new Map();
        Object.entries(json.data.premiumPets).forEach(([key, value]) => {
          premiumpets.set(key, new PetState(key, this));
        }, this);
        this.premiumpets.merge(premiumpets);

        const baseEggs = new Map();
        const questEggs = new Map();
        const questEggKeys = Object.keys(json.data.questEggs);

        Object.entries(json.data.eggs).forEach(([key, value]) => {
          const egg = new EggState(value);
          if (questEggKeys.includes(key)) questEggs.set(key, egg);
          else baseEggs.set(key, egg);
        });

        this.eggs.base.merge(baseEggs);
        this.eggs.quest.merge(questEggs);

        const basePotions = new Map();
        const premiumPotions = new Map();
        const wackyPotions = new Map();
        const premiumPotionKeys = Object.keys(json.data.premiumHatchingPotions);
        const wackyPotionKeys = Object.keys(json.data.wackyHatchingPotions);

        Object.entries(json.data.hatchingPotions).forEach(([key, value]) => {
          const potion = new PotionState(value);
          if (premiumPotionKeys.includes(key)) premiumPotions.set(key, potion);
          else if (wackyPotionKeys.includes(key)) wackyPotions.set(key, potion);
          else basePotions.set(key, potion);
        }, this);

        // apply a small adjustment to the Glow-in-the-Dark potion name
        premiumPotions.get('Glow').data.text = 'Glow';

        this.potions.base.merge(basePotions);
        this.potions.premium.merge(premiumPotions);
        this.potions.wacky.merge(wackyPotions);

        const gear = new Map();
        Object.entries(json.data.gear.flat).forEach(([key, value]) => {
          gear.set(key, new GearState(value));
        });

        // remove gear without an image (i.e. all the base gear)
        const baseGearKeys = ['armor_base_0', 'back_base_0', 'body_base_0', 'eyewear_base_0', 'headAccessory_base_0', 'head_base_0', 'shield_base_0', 'weapon_base_0'];
        baseGearKeys.forEach((key) => gear.delete(key));

        this.gear.merge(gear);

        const backgrounds = new Map();
        Object.entries(json.data.backgroundsFlat).forEach(([key, value]) => {
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
