import { observable, action, computed } from 'mobx';
import UserState from "./UserState";
import QuestState from "./QuestState";
import PetState from "./PetState";
import EggState from "./EggState";
import GearState from "./GearState";
import BackgroundState from "./BackgroundState";

class AppStore {
  @observable loadingobjects = true;
  @observable quests = new Map();
  @observable pets = new Map();
  @observable basepets = new Map();
  @observable premiumpets = new Map();
  @observable eggs = new Map();
  @observable baseeggs = new Map();
  @observable gear = new Map();
  @observable backgrounds = new Map();
  @observable users = [];
  @observable infoUser = "";

  @observable menupage = "petsquesteggs";


  @action gotoPetsQuestEggs() {
    this.menupage = "petsquesteggs";
  }

  @action gotoBasePets() {
    this.menupage = "basepets";
  }  

  @action gotoPremiumPets() {
    this.menupage = "premiumpets";
  }  

  @action gotoOtherQuests() {
    this.menupage = "otherquests";
  }
  
  @action gotoGear() {
    this.menupage = "gear";
  }

  @action gotoBackgrounds() {
    this.menupage = "backgrounds";
  }  

  @action gotoAbout() {
    this.menupage = "about";
  }  

  constructor() {
    this.fetchCommonObjects();
  }

  @action fetchCommonObjects() {
    //https://habitica.com/apidoc/#api-Content-ContentGet
    window.fetch('https://habitica.com/api/v3/content')
    .then(res => res.json())
    .then(action(json => {
      const quests = new Map();
      //this.quests.merge(json.data.quests);
      new Map(Object.entries(json.data.quests)).forEach(function(value, key) {
        quests.set(key,new QuestState(key, value, this));
      },this);
      this.quests.merge(quests);

      const pets = new Map();
      new Map(Object.entries(json.data.questPets)).forEach(function(value,key){
         pets.set(key, new PetState(key, this));
      },this);
      this.pets.merge(pets);

      const basepets = new Map();
      new Map(Object.entries(json.data.pets)).forEach(function(value,key){
         basepets.set(key, new PetState(key, this));
      },this);
      this.basepets.merge(basepets);      

      const premiumpets = new Map();
      new Map(Object.entries(json.data.premiumPets)).forEach(function(value,key){
         premiumpets.set(key, new PetState(key, this));
      },this);
      this.premiumpets.merge(premiumpets);           

      const eggs = new Map();
      new Map(Object.entries(json.data.questEggs)).forEach(function(value,key){
        eggs.set(key, new EggState(key, value, this));
      },this);
      this.eggs.merge(eggs);   

      const baseeggs = new Map();
      new Map(Object.entries(json.data.eggs)).forEach(function(value,key){
        if(this.eggs.get(key) === undefined)
          baseeggs.set(key, new EggState(key, value, this));
      },this);
      this.baseeggs.merge(baseeggs);    


      const gear = new Map();
      new Map(Object.entries(json.data.gear.flat)).forEach(function(value,key){
        gear.set(key, new GearState(key, value, this));
      },this);
      this.gear.merge(gear);        
      
      
      const backgrounds = new Map();
      new Map(Object.entries(json.data.backgroundsFlat)).forEach(function(value,key){
        backgrounds.set(key, new BackgroundState(key, value, this));
      },this);
      this.backgrounds.merge(backgrounds);      
      

      this.loadingobjects = false;
      this.loadQueryString();

      //testlink = ?users=f600354c-9d34-4a4c-a38d-cae52cf58705|0c70156b-4b7e-4fd6-b704-4e832b4580a6|c06b7879-feb2-4c5b-a13e-4a5a2878b9e2|ce787cea-383b-4381-82c4-5060e03d5e92|eb17ca88-16f3-4d77-ad57-4c2cc2cc1433|80d34f3c-8231-4133-9406-391bdf4449a3|5ba6203e-570a-49d3-9027-3a1115a73db8|372ca806-dcea-4013-83e3-411e63ef92a4|bd28fa68-205a-48f4-a707-2ecc47ac5920|c6dbf416-47ef-428b-a452-3c154049757f|d3de6635-37f7-4369-99c3-399d036d0898|abf7a2d4-caf0-4a98-b053-49313e8fc262
    }))
  }

  @action loadQueryString() {
    this.users.clear();
    var qstringusers = this.getQueryVariable("users");
    if(qstringusers !== false){
      qstringusers = decodeURIComponent(qstringusers);
      if(qstringusers.indexOf("|") > 1){
        qstringusers.split('|').forEach(function(val,index){
          this.addUser(val);
        },this)
          
      }
      else{
        this.addUser(qstringusers);
      }
    }
  }

  @action addUser(userid) {
      this.users.push(new UserState(this, userid));
      this.setQueryVariable();
  }

  @action removeUser(user) {
      this.users.remove(user);
      //also remove it from quests
      this.quests.forEach(function(value,key,map){
        value.removeUser(user);
      });
      //also remove it from pets
      this.pets.forEach(function(value,key,map){
        value.removeUser(user);
      });
      //also remove it from eggs
      this.eggs.forEach(function(value,key,map){
        value.removeUser(user);
      }); 

      this.gear.forEach(function(value,key,map){
        value.removeUser(user);
      });    

      this.setQueryVariable();
  }
  @action setInfoUser(user){
    this.infoUser = user;
  }
 
  @computed get petCategories() {
    var categories = new Set();
    var pets = [...this.pets].map(([id,pet]) =>  pet)
        
    for(var pet of pets){
        categories.add(pet.basetype);
    }
    return categories;
  }

  @computed get basepetCategories() {
    var categories = new Set();
    var pets = [...this.basepets].map(([id,pet]) =>  pet)
        
    for(var pet of pets){
        categories.add(pet.basetype);
    }
    return categories;
  }  

  @computed get premiumpetCategories() {
    var categories = new Set();
    var pets = [...this.premiumpets].map(([id,pet]) =>  pet)
        
    for(var pet of pets){
        categories.add(pet.basetype);
    }
    return categories;
  } 

  @computed get totalNeededPetsParty () {
    return [...this.pets].map(([id,pet]) =>  pet)
        .reduce((prevVal, pet) =>  prevVal + pet.needed , 0);
  }
  
  @computed get totalCountPetsParty() {
    return [...this.pets].map(([id,pet]) =>  pet)
        .reduce((prevVal, pet) =>  prevVal + pet.count , 0);
  }

  @computed get totalCountPets(){
    return ([...this.pets].length * 2) * this.users.length;
  }

  @computed get totalNeededBasePetsParty () {
    return [...this.basepets].map(([id,pet]) =>  pet)
        .reduce((prevVal, pet) =>  prevVal + pet.needed , 0);
  }
  
  @computed get totalCountBasePetsParty() {
    return [...this.basepets].map(([id,pet]) =>  pet)
        .reduce((prevVal, pet) =>  prevVal + pet.count , 0);
  }

  @computed get totalCountBasePets(){
    return ([...this.basepets].length * 2) * this.users.length;
  }

  @computed get totalNeededPremiumPetsParty () {
    return [...this.premiumpets].map(([id,pet]) =>  pet)
        .reduce((prevVal, pet) =>  prevVal + pet.needed , 0);
  }
  
  @computed get totalCountPremiumPetsParty() {
    return [...this.premiumpets].map(([id,pet]) =>  pet)
        .reduce((prevVal, pet) =>  prevVal + pet.count , 0);
  }

  @computed get totalCountPremiumPets(){
    return ([...this.premiumpets].length * 2) * this.users.length;
  }  

  @computed get gearleaderboard() {
    return this.users.sort(function(a,b){
      if(a.totalGearCount > b.totalGearCount){
          return -1;
      }
      if(a.totalGearCount < b.totalGearCount){
          return 1;
      }
    });
  }

  @computed get top3gearleaderboard(){
    if(this.gearleaderboard.length >= 2) {
      return this.gearleaderboard.slice(0,3);
    }
    else{
      return this.gearleaderboard;
    }
  }    

  @computed get petleaderboard() {
    return this.users.sort(function(a,b){
      if(a.totalPetCount > b.totalPetCount){
          return -1;
      }
      if(a.totalPetCount < b.totalPetCount){
          return 1;
      }
    });
  }

  @computed get top3petleaderboard(){
    if(this.petleaderboard.length >= 2) {
      return this.petleaderboard.slice(0,3);
    }
    else{
      return this.petleaderboard;
    }
  }  

  @computed get basepetleaderboard() {
    return this.users.sort(function(a,b){
      if(a.totalBasePetCount > b.totalBasePetCount){
          return -1;
      }
      if(a.totalBasePetCount < b.totalBasePetCount){
          return 1;
      }
    });
  }

  @computed get top3basepetleaderboard(){
    if(this.basepetleaderboard.length >= 2) {
      return this.basepetleaderboard.slice(0,3);
    }
    else{
      return this.basepetleaderboard;
    }
  }   
  

  @computed get premiumpetleaderboard() {
    return this.users.sort(function(a,b){
      if(a.totalPremiumPetCount > b.totalPremiumPetCount){
          return -1;
      }
      if(a.totalPremiumPetCount < b.totalPremiumPetCount){
          return 1;
      }
    });
  }

  @computed get top3premiumpetleaderboard(){
    if(this.premiumpetleaderboard.length >= 2) {
      return this.premiumpetleaderboard.slice(0,3);
    }
    else{
      return this.premiumpetleaderboard;
    }
  }   

  @computed get userQuerystring () {
    let qs = "";
    [...this.users].forEach(function(val,index){
      qs = qs + "|" + val.id
    })
    return qs.slice(1,qs.length);
  }

  setQueryVariable = function() {
    history.pushState(this.userQuerystring,"users","?users="+ this.userQuerystring);
  }

  getQueryVariable = function(variable)
  {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
        }
        return(false);
  } 
      
}

export default AppStore;