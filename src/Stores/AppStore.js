import { observable, action } from 'mobx';
import UserState from "./UserState";
import QuestState from "./QuestState";

class AppStore {
  @observable loadingobjects = true;
  @observable quests = new Map();
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
      this.loadingobjects = false;
      console.log(this.quests);
      this.addUser("eb17ca88-16f3-4d77-ad57-4c2cc2cc1433");
      this.addUser("d3de6635-37f7-4369-99c3-399d036d0898");      
    }))
  }

  @action addUser(userid) {
      this.users.push(new UserState(this, userid));
  }
  @action removeUser(user) {
      this.users.remove(user);
  }
  
}

export default AppStore;