import { action, computed, observable } from 'mobx';

import ItemState from './ItemState';

class BackgroundState extends ItemState {
  get id() {
    return this.key;
  }

  get tooltip() {
    return this.data.text;
  }

  userCount(user) {
    return (this.users.includes(user) ? 1 : 0);
  }
}

export default BackgroundState;
