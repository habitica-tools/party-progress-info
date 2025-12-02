import { action, computed, observable } from 'mobx';

import HabiticaAPI from './HabiticaAPI';

import BackgroundState from './BackgroundState';
import PetState from './PetState';
import UserState from './UserState';

import EggState from './States/EggState';
import GearState from './States/GearState';
import PotionState from './States/PotionState';
import QuestState from './States/QuestState';

class AppStore {
  @observable accessor loadingObjects = true;

  quests = observable.map(new Map());
  pets = observable.map(new Map());
  basepets = observable.map(new Map());
  premiumpets = observable.map(new Map());
  gear = observable.map(new Map());
  backgrounds = observable.map(new Map());

  eggs = {
    categories: ['drop', 'quest'],
    drop: observable.map(new Map()),
    quest: observable.map(new Map()),
  };

  potions = {
    categories: ['drop', 'premium', 'wacky'],
    drop: observable.map(new Map()),
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

    // load credentials from environment variables if available
    const userId = process.env.HABITICA_USER_ID;
    const apiToken = process.env.HABITICA_API_TOKEN;
    if (userId !== undefined && apiToken !== undefined) {
      this.api.setCredentials(userId, apiToken);
      this.loadQueryString();
      this.addUser(userId);
    }
  }

  @action fetchCommonObjects() {
    this.api.getContent()
      .then(action((json) => {
        const createStateMapFromList = (list, StateClass) => {
          const map = new Map();
          Object.entries(list).forEach(([key, value]) => {
            map.set(key, new StateClass(value));
          });
          return map;
        }

        this.quests.merge(createStateMapFromList(json.data.quests, QuestState));

        this.eggs.drop.merge(createStateMapFromList(json.data.dropEggs, EggState));
        this.eggs.quest.merge(createStateMapFromList(json.data.questEggs, EggState));

        this.potions.drop.merge(createStateMapFromList(json.data.dropHatchingPotions, PotionState));
        this.potions.premium.merge(createStateMapFromList(json.data.premiumHatchingPotions, PotionState));
        this.potions.wacky.merge(createStateMapFromList(json.data.wackyHatchingPotions, PotionState));
        // apply a small adjustment to the Glow-in-the-Dark potion name
        this.potions.premium.get('Glow').data.text = 'Glow';

        const gear = createStateMapFromList(json.data.gear.flat, GearState);
        // remove gear without an image (i.e. all the base gear)
        const baseGearKeys = ['armor_base_0', 'back_base_0', 'body_base_0', 'eyewear_base_0', 'headAccessory_base_0', 'head_base_0', 'shield_base_0', 'weapon_base_0'];
        baseGearKeys.forEach((key) => gear.delete(key));
        this.gear.merge(gear);

        this.backgrounds.merge(createStateMapFromList(json.data.backgroundsFlat, BackgroundState));

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

        this.loadingObjects = false;
        this.reloadUsers();
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

    const removeUserFromMap = (map, user) => {
      map.forEach((value) => {
        value.removeUser(user);
      });
    }

    // also remove it from quests
    removeUserFromMap(this.quests, user);

    // also remove it from pets
    removeUserFromMap(this.pets, user);
    removeUserFromMap(this.basepets, user);
    removeUserFromMap(this.premiumpets, user);

    // also remove it from eggs
    this.eggs.categories.forEach((category) => {
      removeUserFromMap(this.eggs[category], user);
    });

    // also remove it from potions
    this.potions.categories.forEach((category) => {
      removeUserFromMap(this.potions[category], user);
    });

    // also remove it from gear
    removeUserFromMap(this.gear, user);

    // also remove it from backgrounds
    // removeUserFromMap(this.backgrounds, user);

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
