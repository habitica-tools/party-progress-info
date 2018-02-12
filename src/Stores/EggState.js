import { observable, action, computed } from 'mobx';

class EggState {
  id = null;
  store = null;
  @observable users = [];
  
  constructor(egg,store) {
    this.id = egg;
    this.store = store;
  }

  @computed get count() {
    var count=0;
    this.users.forEach(function(value,index,array){
         if(value.data.items.eggs[this.id] !== undefined){
            count = count + value.data.items.eggs[this.id]
         }

    },this);
    return count;
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

}

export default EggState;