//Todo

//user.data.items.pets
//Axolotl-Base:5
//Axolotl-CottonCandyPink:-1
//Axolotl-Zombie:-1
//user.data.items.mounts
//Aloxlotl-Base:true

// 5 - 40 inprogress
// -1  Mount no Pet
// 5 can also mean completed

//So to decide which Pets are favorable it needs to be -1 or not in List compared to general data.questpets
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