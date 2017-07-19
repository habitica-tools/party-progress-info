import { observable, action, computed } from 'mobx';

class QuestState {
  store = null;
  @observable data = {};
  @observable users = [];
  
  constructor(quest) {
    this.data = quest;
  }

  @action addUser(userid, number) {
    this.users.push({userid,number});
  }

  //computeds
  @computed get count(){
    return this.users.length;
  }
  
}

export default QuestState;