import { observable, action, computed } from 'mobx';

class QuestState {
  store = null;
  id = null;
  @observable data = {};
  @observable users = [];
  
  constructor(quest) {
    this.id = quest.key;
    this.data = quest;
  }

  @action addUser(user) {
    this.users.push(user);
  }

  @action removeUser(user) {
    try{
      this.users.remove(user);
    }
    catch(e){}
  }  

  //computeds
  @computed get count(){
    return this.users.length;
  }
  
}

export default QuestState;