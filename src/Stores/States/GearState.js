import ItemState from './ItemState';

class GearState extends ItemState {
  get tooltip() {
    return this.data.text;
  }

  userCount(user) {
    return (this.users.includes(user) ? 1 : 0);
  }
}

export default GearState;
