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

class PetState {
  id = null;
  @observable users = [];
  
  constructor(questpet) {
    this.id = questpet;
  }

  @computed get basetype(){
      if(this.id !== null){
          return this.id.slice(0,this.id.indexOf('-'));
      }
      else{
          return "";
      }
  }

  @computed get count(){
    var count=0;
    var me = this;
    this.users.forEach(function(value,index,array){
      count = count + value.data.items.pets[me.id];
    });
    return count; // this.users.length;
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

export default PetState;