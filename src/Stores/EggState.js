import { observable, action, computed } from 'mobx';

class EggState {
  id = null;
  store = null;
  @observable accessor users = [];
  @observable accessor data = {};

  constructor(key,egg,store) {
    this.id = key;
    this.data = egg;
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

  usercount(user) {
    return (user.data.items.eggs[this.id] !== undefined ? user.data.items.eggs[this.id] : 0);
  }

  @computed get selectedcount(){
    var count=0;
    count = this.users.filter(u => u.isInfoUser)
      .reduce((prevVal, user) => prevVal + (user.data.items.eggs[this.id] !== undefined ? user.data.items.eggs[this.id] : 0), count);
    return count;
  }

}

export default EggState;