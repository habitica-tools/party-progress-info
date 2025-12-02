import ItemState from './ItemState';

class PetState extends ItemState {
  get eggKey() {
    return this.data.egg;
  }

  get potionKey() {
    return this.data.potion;
  }

  userCount(user) {
    return (this.users.includes(user) ? 1 : 0);
  }
}

export default PetState;
