import { action, computed, observable } from 'mobx';

class ItemState {
  data = {};
  store = null;
  @observable accessor users = [];

  static userItems(user) {
    throw new Error('NotImplementedError: subclasses must implement userItems');
  }

  constructor(data, store = null) {
    this.data = data;
    this.store = store;
  }

  get key() {
    return this.data.key;
  }

  get imageKey() {
    return this.key;
  }

  get tooltip() {
    return this.data.text;
  }

  @action addUser(user) {
    this.users.push(user);
  }

  @action removeUser(user) {
    this.users.remove(user);
  }

  userCount(user) {
    return (this.constructor.userItems(user)[this.key] !== undefined ? this.constructor.userItems(user)[this.key] : 0);
  }

  usersCount(users) {
    return users.reduce((value, user) => value + this.userCount(user), 0);
  }

  @computed get count() {
    return this.usersCount(this.users);
  }

  @computed get selectedCount() {
    return this.usersCount(this.users.filter((user) => user.isInfoUser));
  }

  // eslint-disable-next-line class-methods-use-this
  @computed get neededCount() {
    return null;
  }
}

export default ItemState;
