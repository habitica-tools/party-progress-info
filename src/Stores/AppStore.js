import { action, computed, observable } from 'mobx';

import HabiticaAPI from './HabiticaAPI';

import UserState from './UserState';

import BackgroundState from './States/BackgroundState';
import CombinedPetState from './States/CombinedPetState';
import EggState from './States/EggState';
import GearState from './States/GearState';
import MountState from './States/MountState';
import PetState from './States/PetState';
import PotionState from './States/PotionState';
import QuestState from './States/QuestState';

class AppStore {
  @observable accessor currentPage = 'questPets';
  @observable accessor loadingObjects = true;

  @observable accessor users = [];
  @observable accessor infoUser = [];

  flat = {
    quests: new Map(),
    pets: new Map(),
    mounts: new Map(),
    eggs: new Map(),
    potions: new Map(),
    gear: new Map(),
    backgrounds: new Map(),
  }

  quests = observable.map(new Map());
  gear = observable.map(new Map());
  backgrounds = observable.map(new Map());

  pets = {
    categories: ['drop', 'quest', 'premium', 'wacky', 'special'],
    drop: observable.map(new Map()),
    quest: observable.map(new Map()),
    premium: observable.map(new Map()),
    wacky: observable.map(new Map()),
    special: observable.map(new Map()),
  }

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

  api = undefined;
  loadParty = false;

  @action setPage(page) {
    this.currentPage = page;
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
            map.set(key, new StateClass(value, this));
          }, this);
          return map;
        }

        const quests = createStateMapFromList(json.data.quests, QuestState);
        this.flat.quests = quests;
        this.quests.merge(quests);

        const dropEggs = createStateMapFromList(json.data.dropEggs, EggState);
        const questEggs = createStateMapFromList(json.data.questEggs, EggState);
        this.flat.eggs = new Map([...dropEggs, ...questEggs]);
        this.eggs.drop.merge(dropEggs);
        this.eggs.quest.merge(questEggs);

        const dropPotions = createStateMapFromList(json.data.dropHatchingPotions, PotionState);
        const premiumPotions = createStateMapFromList(json.data.premiumHatchingPotions, PotionState);
        const wackyPotions = createStateMapFromList(json.data.wackyHatchingPotions, PotionState);
        this.flat.potions = new Map([...dropPotions, ...premiumPotions, ...wackyPotions]);
        this.potions.drop.merge(dropPotions);
        this.potions.premium.merge(premiumPotions);
        this.potions.wacky.merge(wackyPotions);
        // apply a small adjustment to the Glow-in-the-Dark potion name
        this.potions.premium.get('Glow').data.text = 'Glow';

        const gear = createStateMapFromList(json.data.gear.flat, GearState);
        // remove gear without an image (i.e. all the base gear)
        const baseGearKeys = ['armor_base_0', 'back_base_0', 'body_base_0', 'eyewear_base_0', 'headAccessory_base_0', 'head_base_0', 'shield_base_0', 'weapon_base_0'];
        baseGearKeys.forEach((key) => gear.delete(key));
        this.flat.gear = gear;
        this.gear.merge(gear);

        const backgrounds = createStateMapFromList(json.data.backgroundsFlat, BackgroundState);
        this.flat.backgrounds = backgrounds;
        this.backgrounds.merge(backgrounds);

        const createCombinedPetStates = (type, outerList, innerList, innerItemKey, innerItemIsPotion) => {
          const innerItem = innerList.get(innerItemKey);

          const mapToOuter = (outer, inner) => outer;
          const mapToInner = (outer, inner) => inner;

          const eggFn = innerItemIsPotion ? mapToOuter : mapToInner;
          const potionFn = innerItemIsPotion ? mapToInner : mapToOuter;

          const dataGenerator = (outer, inner) => {
            const egg = eggFn(outer, inner);
            const potion = potionFn(outer, inner);

            return {
              key: egg.key + '-' + potion.key,
              egg: egg,
              potion: potion,
              text: egg.tooltip + ' ' + potion.tooltip,
              type: type,
            }
          };

          const map = new Map();
          outerList.forEach((outer) => {
            const data = dataGenerator(outer, innerItem);
            const state = new CombinedPetState(
              Object.assign(data, { key: outer.key, imageKey: data.key }),
              this,
            );
            innerList.forEach((inner) => {
              const data = dataGenerator(outer, inner);
              state.petStates.set(data.key, new PetState(data, this));
              state.mountStates.set(data.key, new MountState(
                Object.assign(data, { text: eggFn(outer, inner).data.mountText + ' ' + potionFn(outer, inner).tooltip }),
                this,
              ));
            });
            map.set(state.key, state);
          });
          return map;
        };

        const dropPets = createCombinedPetStates('drop', this.eggs.drop, this.potions.drop, 'Base', true);
        const questPets = createCombinedPetStates('quest', this.eggs.quest, this.potions.drop, 'Base', true);
        const premiumPets = createCombinedPetStates('premium', this.potions.premium, this.eggs.drop, 'Wolf', false);
        const wackyPets = createCombinedPetStates('wacky', this.potions.wacky, this.eggs.drop, 'Wolf', false);

        const specialPetDummyData = {
          egg: null, eggData: null, potion: null, potionData: null,
        };

        const specialPets = new Map();
        Object.keys(json.data.specialPets).forEach((key) => {
          const petData = Object.assign(json.data.petInfo[key], specialPetDummyData);

          const state = new CombinedPetState(
            Object.assign(petData, { imageKey: petData.key }),
            this,
          );
          state.petStates.set(key, new PetState(petData, this));

          if (key in json.data.specialMounts) {
            state.mountStates.set(key, new MountState(
              Object.assign(json.data.mountInfo[key], specialPetDummyData),
              this,
            ));
          }

          specialPets.set(key, state);
        });

        this.flat.pets = new Map([
          ...Array.from(dropPets.values()).flatMap((combinedState) => Array.from(combinedState.petStates.entries())),
          ...Array.from(questPets.values()).flatMap((combinedState) => Array.from(combinedState.petStates.entries())),
          ...Array.from(premiumPets.values()).flatMap((combinedState) => Array.from(combinedState.petStates.entries())),
          ...Array.from(wackyPets.values()).flatMap((combinedState) => Array.from(combinedState.petStates.entries())),
          ...Array.from(specialPets.values()).flatMap((combinedState) => Array.from(combinedState.petStates.entries())),
        ]);
        this.flat.mounts = new Map([
          ...Array.from(dropPets.values()).flatMap((combinedState) => Array.from(combinedState.mountStates.entries())),
          ...Array.from(questPets.values()).flatMap((combinedState) => Array.from(combinedState.mountStates.entries())),
          ...Array.from(premiumPets.values()).flatMap((combinedState) => Array.from(combinedState.mountStates.entries())),
          ...Array.from(wackyPets.values()).flatMap((combinedState) => Array.from(combinedState.mountStates.entries())),
          ...Array.from(specialPets.values()).flatMap((combinedState) => Array.from(combinedState.mountStates.entries())),
        ]);

        this.pets.drop.merge(dropPets);
        this.pets.quest.merge(questPets);
        this.pets.premium.merge(premiumPets);
        this.pets.wacky.merge(wackyPets);
        this.pets.special.merge(specialPets);

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

  filteredQuests(category) {
    return this.quests.entries().filter(([_, quest]) => {
      if (quest.data.category === category) {
        return true;
      }

      if (quest.data.category === 'timeTravelers') {
        return (
          (category === 'pet' && quest.data.drop.items[0].type === 'eggs')
          || (category === 'hatchingPotion' && quest.data.drop.items[0].type === 'hatchingPotions')
        );
      }

      return false;
    })
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

    // also remove it from pets
    this.pets.categories.forEach((category) => {
      removeUserFromMap(this.pets[category], user);
    });

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

  @computed get validUsers() {
    return this.users.filter((user) => !(user.loading || user.invalid));
  }

  @computed get validUserCount() {
    return this.validUsers.length;
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
