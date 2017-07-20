import { observable, action } from 'mobx';
import UserState from "./UserState";
import QuestState from "./QuestState";
import PetState from "./PetState";

class AppStore {
  @observable loadingobjects = true;
  @observable quests = new Map();
  @observable pets = new Map();
  @observable users = [];
  

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
        quests.set(key,new QuestState(value));
      });
      this.quests.merge(quests);

      const pets = new Map();
      new Map(Object.entries(json.data.questPets)).forEach(function(value,key){
        pets.set(key, new PetState(key));
      });
      this.pets.merge(pets);

      this.loadingobjects = false;
      //Need to fetch this from querystring
      this.addUser("f600354c-9d34-4a4c-a38d-cae52cf58705");
      this.addUser("0c70156b-4b7e-4fd6-b704-4e832b4580a6");
      this.addUser("c06b7879-feb2-4c5b-a13e-4a5a2878b9e2");
      this.addUser("ce787cea-383b-4381-82c4-5060e03d5e92");
      this.addUser("eb17ca88-16f3-4d77-ad57-4c2cc2cc1433");
      this.addUser("80d34f3c-8231-4133-9406-391bdf4449a3");
      this.addUser("5ba6203e-570a-49d3-9027-3a1115a73db8");
      this.addUser("372ca806-dcea-4013-83e3-411e63ef92a4");
      this.addUser("bd28fa68-205a-48f4-a707-2ecc47ac5920");
      this.addUser("c6dbf416-47ef-428b-a452-3c154049757f");
      this.addUser("d3de6635-37f7-4369-99c3-399d036d0898");      
      this.addUser("abf7a2d4-caf0-4a98-b053-49313e8fc262");
    }))
  }

  @action addUser(userid) {
      this.users.push(new UserState(this, userid));
  }

  @action removeUser(user) {
      this.users.remove(user);
      //also remove it from quests
      this.quests.forEach(function(value,key,map){
        value.removeUser(user);
      });
      //also remove it from petts
      this.pets.forEach(function(value,key,map){
        value.removeUser(user);
      })      
  }
  
}

export default AppStore;