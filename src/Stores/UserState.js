import { action, computed, observable } from 'mobx';

class UserState {
  @observable accessor loading = true;
  @observable accessor invalid = false;

  data = {};
  id = null;
  store = null;

  constructor(store, id) {
    this.store = store;
    this.id = id;
    this.addUser(id);
  }

  @computed get damage() {
    if (!this.loading) {
      if (this.data.party !== undefined) {
        if (this.data.party.quest !== undefined) {
          if (this.data.party.quest.progress !== undefined) {
            return parseInt(this.data.party.quest.progress.up);
          }
        }
      }
    }
    return 0;
  }

  @computed get totalPremiumPetCount() {
    let count = 0;
    if (!this.loading) {
      [...this.store.premiumpets].map((pet) => pet[1])
        .filter((pet) => (pet.users.includes(this) ? pet : null))
        .forEach((pet) => {
          if (this.data.items.pets !== undefined && this.data.items.pets[pet.id] > 0) {
            count += 1;
          }
          if (this.data.items.mounts !== undefined && this.data.items.mounts[pet.id] > 0) {
            count += 1;
          }
        }, this)
    }
    return count;
  }

  @computed get totalGearCount() {
    let count = 0;
    if (!this.loading) {
      [...this.store.gear].map((gear) => gear[1])
        .filter((gear) => (gear.users.includes(this) ? gear : null))
        .forEach((gear) => {
          if (this.data.items.gear.owned[gear.id] !== undefined) {
            count += 1;
          }
        }, this)
    }
    return count;
  }

  @action addUser(userid) {
    if (this.store.loadingObjects) {
      this.loading = true;
      return;
    }

    if (!this.store.api.isValidToken(userid)) {
      this.loading = false;
      this.invalid = true;
      this.data.customMessage = '"' + userid + '" is not a valid User ID';
      return;
    }

    if (!this.store.api.hasValidCredentials) {
      this.loading = false;
      this.invalid = true;
      this.data.customMessage = 'Valid authentication required to fetch user data';
      return;
    }

    this.loading = true;
    this.store.api.getUser(userid)
      .then(action((json) => {
        this.data = json.data;
        this.loading = false;

        const addUserToItemMap = (userData, itemMap) => {
          if (userData !== undefined) {
            Object.entries(userData).forEach(([key, value]) => {
              const item = itemMap.get(key);
              if (item !== undefined && value > 0) {
                item.addUser(this);
              }
            }, this);
          }
        };

        // go over quests
        addUserToItemMap(json.data.items.quests, this.store.flat.quests);

        // go over questpets / base pets / premium pets
        if (json.data.items.pets !== undefined) {
          Object.entries(json.data.items.pets).forEach(([key, value]) => {
            if (key !== null && key !== undefined) { // TODO: redundant?
              const pet = this.store.questpets.get(key);
              if (pet !== undefined) {
                pet.addUser(this);
                if (value > 0) {
                  pet.addUserWithPet(this);
                }
              }
              const basepet = this.store.basepets.get(key);
              if (basepet !== undefined) {
                basepet.addUser(this);
                if (value > 0) {
                  basepet.addUserWithPet(this);
                }
              }
              const premiumpet = this.store.premiumpets.get(key);
              if (premiumpet !== undefined) {
                premiumpet.addUser(this);
                if (value > 0) {
                  premiumpet.addUserWithPet(this);
                }
              }
            }
          }, this);
          if (json.data.items.mounts !== undefined) {
            Object.entries(json.data.items.mounts).forEach(([key, value]) => {
              if (key !== null && key !== undefined && value !== null && value === true) {
                const pet = this.store.questpets.get(key);
                if (pet !== undefined) pet.addUserWithMount(this);
                const basepet = this.store.basepets.get(key);
                if (basepet !== undefined) basepet.addUserWithMount(this);
                const premiumpet = this.store.premiumpets.get(key);
                if (premiumpet !== undefined) premiumpet.addUserWithMount(this);
              }
            }, this);
          }
        }

        // go over pets
        addUserToItemMap(json.data.items.pets, this.store.flat.pets);

        // go over mounts
        addUserToItemMap(json.data.items.mounts, this.store.flat.mounts);

        // go over eggs
        addUserToItemMap(json.data.items.eggs, this.store.flat.eggs);

        // go over hatching potions
        addUserToItemMap(json.data.items.hatchingPotions, this.store.flat.potions);

        // go over gear
        if (json.data.items.gear !== undefined) {
          addUserToItemMap(json.data.items.gear.owned, this.store.flat.gear);
        }

        // go over backgrounds
        // not yet available in the API
      }))
      .catch(action((res) => {
        if (res.status === undefined) {
          throw res;
        }

        // 400: invalid userid
        if (res.status === 400) {
          this.data.customMessage = '"' + userid + '" is not a valid User ID';
        }
        // 401: invalid credentials
        else if (res.status === 401) {
          this.data.customMessage = 'Invalid API credentials';
        }
        // 404: userid not found
        else if (res.status === 404) {
          this.data.customMessage = 'User ID "' + userid + '" not found';
        }

        res.json()
          .then(action((json) => {
            if (!Object.hasOwn(this.data, 'customMessage')) {
              this.data = json;
              this.data.customMessage = JSON.stringify(json);
            }

            this.invalid = true;
            this.loading = false;
          }));
      }));
  }

  @computed get isInfoUser() {
    return this.store.infoUser.includes(this);
  }
}

export default UserState;
