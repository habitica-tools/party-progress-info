import { observable, action, computed } from 'mobx';

class EggState {
  id = null;
  store = null;
  @observable users = [];
  @observable data = {};
  
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
  usercount(user){
    return computed(() => 
          this.users.filter(u => u.id === user.id).length === 1 ? 
            this.users.filter(u => u.id === user.id)[0].data.items.eggs[this.id] !== undefined ?  
            this.users.filter(u => u.id === user.id)[0].data.items.eggs[this.id] :
            0
            : 0
          ).get()
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
      if(this.store.infoUser !== ""){
        count = this.usercount(this.store.infoUser)
      }
    return count;
  }    

}

export default EggState;