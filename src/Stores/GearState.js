import { observable, action, computed } from 'mobx';

class GearState {
  store = null;
  id = null;
  @observable data = {};
  @observable users = [];
  
  constructor(key, gear, store) {
    this.id = key;
    this.data = gear
    this.store = store;
  }

  @computed get count() {   
    return this.users.length;
  }

  @computed get selectedcount(){
    let count =0;
    if(this.store.infoUser !== ""){
      if(this.users.filter(user => user === this.store.infoUser).length >= 1){
          count = 1;
      }
    }
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

export default GearState;