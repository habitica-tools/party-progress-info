import { action, computed, observable } from 'mobx';

class GearState {
  store = null;
  id = null;
  @observable accessor data = {};
  @observable accessor users = [];

  constructor(key, gear, store) {
    this.id = key;
    this.data = gear
    this.store = store;
  }

  @computed get count() {
    return this.users.length;
  }

  @computed get selectedcount() {
    let count = 0;
    count = this.users.reduce((prevVal, user) => prevVal + (user.isInfoUser ? 1 : 0), count);
    return count;
  }

  @action addUser(user) {
    this.users.push(user);
  }

  @action removeUser(user) {
    try {
      this.users.remove(user);
    }
    catch (e) { }
  }


}

export default GearState;