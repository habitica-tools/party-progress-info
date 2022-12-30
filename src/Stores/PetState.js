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
  store = null;
  @observable users = [];
  @observable usersWithPet = [];
  @observable usersWithMount = [];
  
  constructor(questpet,store) {
    this.id = questpet;
    this.store = store;
  }

  @computed get basetype(){
      if(this.id !== null){
          return this.id.slice(0,this.id.indexOf('-'));
      }
      else{
          return "";
      }
  }

  @computed get potiontype(){
      if(this.id !== null){
          return this.id.slice(this.id.indexOf('-')+1);
      }
      else{
          return "";
      }
  }

  @computed get needed(){
    var count=0;
    count = this.store.users.length * 2;
    this.users.forEach(function(value,index,array){
        if(value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
            count = count - 1;
        }
        if(value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
            count = count - 1;
        }
    }, this);
    return count; 
  }

  @computed get petsNeeded(){
    var count=0;
    count = this.store.users.length;
    this.users.forEach(function(value,index,array){
        if(value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
            count = count - 1;
        }
    }, this);
    return count; 
  }

  @computed get mountsNeeded(){
    var count=0;
    count = this.store.users.length;
    this.users.forEach(function(value,index,array){
        if(value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
            count = count - 1;
        }
    }, this);
    return count; 
  }

  @computed get count() {
    var count=0;
    this.users.forEach(function(value,index,array){
        if(value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
            count = count + 1;
        }
        if(value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
            count = count + 1;
        }
    },this);
    return count;
  }

  @computed get petCount() {
    var count=0;
    this.users.forEach(function(value,index,array){
        if(value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
            count = count + 1;
        }
    },this);
    return count;
  }

  @computed get mountCount() {
    var count=0;
    this.users.forEach(function(value,index,array){
        if(value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
            count = count + 1;
        }
    },this);
    return count;
  }

  //get usercount 

  //get selectedcount
  @computed get selectedcount(){
    let count=0;
    if(this.store.infoUser !== ""){
        if(this.users.filter(user => user === this.store.infoUser).length >= 1){
            this.users.filter(user => user === this.store.infoUser).forEach(function(value,index,array){
                if(value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
                    count = count + 1;
                }
                if(value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
                    count = count + 1;
                }
           },this)
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

  @action addUserWithPet(user) {
    this.usersWithPet.push(user);
  }

  @action removeUserWithPet(user) {
    try{
      this.usersWithPet.remove(user);
    }
    catch(e){}
  }    

  @action addUserWithMount(user) {
    this.usersWithMount.push(user);
  }

  @action removeUserWithMount(user) {
    try{
      this.usersWithMount.remove(user);
    }
    catch(e){}
  }    

}

export default PetState;