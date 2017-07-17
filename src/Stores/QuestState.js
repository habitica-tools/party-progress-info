import { observable, action, computed } from 'mobx';

class QuestState {
  store = null;
  @observable data = {};
  @observable users = [];
  
  constructor(quest) {
    this.data = quest;
  }

  @action addUser(quest,number, userid) {
    console.log("adding " + userid);
    this.users.push({quest, number, userid});
  }

  //computeds
  @computed get count(){
    return this.users.length;
  }
}

export default QuestState;