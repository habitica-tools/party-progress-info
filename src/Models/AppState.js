import { observable, action } from 'mobx';

class AppState {
  @observable loadingobjects = true;
  @observable habiticaobjects = {
  };
  @observable users = [];

  constructor() {
    this.fetchCommonObjects();
  }

  @action fetchCommonObjects() {
    //https://habitica.com/apidoc/#api-Content-ContentGet
    window.fetch('https://habitica.com/api/v3/content')
    .then(res => res.json())
    .then(action(json => {
      this.habiticaobjects = json.data;
      this.loadingobjects = false;
    }))
  }

  @action fetchUser() {

  }
  
}

export default AppState;