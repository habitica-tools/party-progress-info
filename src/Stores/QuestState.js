import { action, computed, observable } from 'mobx';

class QuestState {
  @observable accessor data = {};
  @observable accessor users = [];

  constructor(data) {
    this.data = data;
  }

  get id() {
    return this.data.key;
  }

  @action addUser(user) {
    this.users.push(user);
  }

  @action removeUser(user) {
    this.users.remove(user);
  }

  userCount(user) {
    return (user.data.items.quests[this.id] !== undefined ? user.data.items.quests[this.id] : 0);
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

export default QuestState;
