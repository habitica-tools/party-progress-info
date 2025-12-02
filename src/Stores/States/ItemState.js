import { action, computed, observable } from 'mobx';

class ItemState {
  @observable accessor data = {};
  @observable accessor users = [];

  static type = null;

  static userItems(user) {
    throw new Error('NotImplementedError: subclasses must implement userItems');
  }

  constructor(data) {
    this.data = data;
  }

  get id() {
    return this.data.key;
  }

  get tooltip() {
    return this.id;
  }

  @action addUser(user) {
    this.users.push(user);
  }

  @action removeUser(user) {
    this.users.remove(user);
  }

  userCount(user) {
    return (this.constructor.userItems(user)[this.id] !== undefined ? this.constructor.userItems(user)[this.id] : 0);
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
}

export default ItemState;
