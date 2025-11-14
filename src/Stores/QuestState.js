import { observable, action, computed } from 'mobx';

class QuestState {
  store = null;
  id = null;
  @observable accessor data = {};
  @observable accessor users = [];

  constructor(key, quest, store) {
    this.id = key;
    this.data = quest;
    this.store = store;
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

  //computeds
  @computed get count() {
    var count = 0;
    this.users.forEach(function (value, index, array) {
      count = count + value.data.items.quests[this.id];
    }, this);
    return count;
  }

  @computed get selectedcount() {
    var count = 0;
    this.users.filter(user => user.isInfoUser).forEach(function (value, index, array) {
      count = count + value.data.items.quests[this.id];
    }, this);
    return count;
  }

}

export default QuestState;