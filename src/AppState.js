import { observable, action } from 'mobx';

class AppState {
  @observable loadingobjects = false;
  @observable habiticaobjects = {};
  @observable timer = 0;



  constructor() {
    /*setInterval(() => {
      this.timer += 1;
    }, 1000);*/
    this.fetchCommonObjects();
  }

  @action resetTimer() {
    this.timer = 0;
  }

  @action fetchCommonObjects() {
    this.loadingobjects = true;
    //https://habitica.com/apidoc/#api-Content-ContentGet
    window.fetch('https://habitica.com/api/v3/content')
    .then(res => res.json())
    .then(action(json => {
      this.habiticaobjects = json;
      this.loadingobjects = false;
    }))
  }
  
}

export default AppState;