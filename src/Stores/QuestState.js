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
    var count=0;
    var me = this;
    this.users.forEach(function(value,index,array){
      count = count + value.data.items.quests[me.id];
    });
    return count;
  }
  
}

export default QuestState;