import { computed } from 'mobx';

import ItemState from './ItemState';

class PetState extends ItemState {
  get egg() {
    return this.data.egg;
  }

  get potion() {
    return this.data.potion;
  }

  get tooltip() {
    return this.potion.tooltip + ' ' + this.egg.tooltip;
  }

  get caption() {
    return this.tooltip;
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
