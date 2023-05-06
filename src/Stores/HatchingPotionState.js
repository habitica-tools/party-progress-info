import { observable, action, computed } from 'mobx';

class HatchingPotionState {
  id = null;
  store = null;
  @observable users = [];
  @observable data = {};
  
  constructor(key,potion,store) {
    this.id = key;
    this.data = potion;
    this.store = store;
  }

  @computed get count() {
    var count=0;
    this.users.forEach(function(value,index,array){
         if(value.data.items.hatchingPotions[this.id] !== undefined){
            count = count + value.data.items.hatchingPotions[this.id]
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

  @computed get selectedcount(){
    var count=0;
    count = this.users.filter(u => u.isInfoUser)
      .reduce((prevVal, user) => prevVal + (user.data.items.hatchingPotions[this.id] !== undefined ? user.data.items.hatchingPotions[this.id] : 0), count);
    return count;
  }   

}

export default HatchingPotionState;