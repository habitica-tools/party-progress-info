import { action, computed, observable } from 'mobx';

class BackgroundState {
  store = null;
  id = null;
  @observable accessor data = {};
  @observable accessor users = [];

  constructor(key, background, store) {
    this.id = key;
    this.data = background
    this.store = store;
  }

  @computed get count() {
    return this.users.length;
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

export default BackgroundState;
