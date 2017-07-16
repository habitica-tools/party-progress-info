import { observable, action, computed } from 'mobx';

class QuestState {
  @observable jsonquest = {};
  @observable users = [];
  
  constructor(quest) {
    this.jsonquest = quest;
  }

  @action addUser(user,number) {
    this.users.push(user);
  }

  //computeds
  @computed get count(){
    return this.users.length();
  }
}

export default QuestState;