import { computed } from 'mobx';

import PetState from './PetState';

class CombinedPetState extends PetState {
  petStates = new Map();
  mountStates = new Map();

  get imageKey() {
    return this.data.imageKey
  }

  get tooltip() {
    return this.key;
  }

  @computed get users() {
    const combinedUsers = new Set();
    this.petStates.forEach((petState) => {
      petState.users.forEach((user) => combinedUsers.add(user));
    });
    this.mountStates.forEach((mountState) => {
      mountState.users.forEach((user) => combinedUsers.add(user));
    });
    return Array.from(combinedUsers);
  }

  userCount(user) {
    let count = 0;
    count += this.petStates.values().reduce((sum, petState) => sum + petState.userCount(user), 0);
    count += this.mountStates.values().reduce((sum, mountState) => sum + mountState.userCount(user), 0);
    return count;
  }

  @computed get neededCount() {
    let needed = 0;
    needed += this.petStates.values().reduce((sum, petState) => sum + petState.neededCount, 0);
    needed += this.mountStates.values().reduce((sum, mountState) => sum + mountState.neededCount, 0);
    return needed;
  }
}

export default CombinedPetState;
