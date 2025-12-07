import ItemState from './ItemState';

class GearState extends ItemState {
  userCount(user) {
    return (this.users.includes(user) ? 1 : 0);
  }
}

export default GearState;
