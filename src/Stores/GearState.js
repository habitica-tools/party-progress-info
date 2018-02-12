import { observable, action, computed } from 'mobx';

class GearState {
  store = null;
  id = null;
  @observable data = {};
  @observable users = [];
  
  constructor(key, gear,store) {
    this.id = key;
    this.data = gear
    this.store = store;
  }

  @computed get count() {   
    return this.users.length;
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