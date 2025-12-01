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

  @computed get totalPetCount() {
    let count = 0;
    if (!this.loading) {
      [...this.store.pets].map((pet) => pet[1])
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

  @computed get totalBasePetCount() {
    let count = 0;
    if (!this.loading) {
      [...this.store.basepets].map((pet) => pet[1])
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

        // go over quests
        if (json.data.items.quests !== undefined) {
          Object.entries(json.data.items.quests).forEach(([key, value]) => {
            if (value > 0) this.store.quests.get(key).addUser(this);
          }, this);
        }

        // go over questpets / base pets / premium pets
        if (json.data.items.pets !== undefined) {
          Object.entries(json.data.items.pets).forEach(([key, value]) => {
            if (key !== null && key !== undefined) { // TODO: redundant?
              const pet = this.store.pets.get(key);
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
                const pet = this.store.pets.get(key);
                if (pet !== undefined) pet.addUserWithMount(this);
                const basepet = this.store.basepets.get(key);
                if (basepet !== undefined) basepet.addUserWithMount(this);
                const premiumpet = this.store.premiumpets.get(key);
                if (premiumpet !== undefined) premiumpet.addUserWithMount(this);
              }
            }, this);
          }
        }

        // go over eggs
        if (json.data.items.eggs !== undefined) {
          Object.entries(json.data.items.eggs).forEach(([key, value]) => {
            if (value > 0 && key !== null && key !== undefined) {
              this.store.eggs.categories.every((category) => {
                const egg = this.store.eggs[category].get(key);
                if (egg !== undefined) {
                  egg.addUser(this);
                  return false;
                }
                return true;
              })
            }
          }, this);
        }

        // go over hatching potions
        if (json.data.items.hatchingPotions !== undefined) {
          Object.entries(json.data.items.hatchingPotions).forEach(([key, value]) => {
            if (value > 0 && key !== null && key !== undefined) {
              this.store.potions.categories.every((category) => {
                const potion = this.store.potions[category].get(key);
                if (potion !== undefined) {
                  potion.addUser(this);
                  return false;
                }
                return true;
              })
            }
          }, this);
        }

        // go over gear
        if (json.data.items.gear !== undefined) {
          Object.entries(json.data.items.gear.owned).forEach(([key, value]) => {
            let gear;
            if (key !== null && key !== undefined) {
              gear = this.store.gear.get(key);
            }
            if (gear !== undefined) {
              if (value > 0) {
                gear.addUser(this);
              }
            }
          }, this);
        }

        // go over backgrounds
        /*
        if(json.data.items.backgrounds !== undefined){
            var backgrounds = new Map(Object.entries(json.data.items.backgrounds.owned));
            backgrounds.forEach(function(value, key) {
                if(key !== null && key !== undefined)
                    var background = this.store.backgrounds.get(key);
                    if(background !== undefined)
                        if(value > 0){
                            backgrounds.addUser(this);
                        }
            },this);
        }
        */
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
