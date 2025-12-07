import { computed } from 'mobx';

import ItemState from './ItemState';

class PetState extends ItemState {
  get eggKey() {
    return this.data.egg;
  }

  get potionKey() {
    return this.data.potion;
  }

  userCount(user) {
    return (this.users.includes(user) ? 1 : 0);
  }

  // Override neededCount to return petsNeeded
  @computed get neededCount() {
    return this.store.validUserCount - this.count;
  }
}

export default PetState;
