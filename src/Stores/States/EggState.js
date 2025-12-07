import ItemState from './ItemState';

class EggState extends ItemState {
  static userItems(user) {
    return user.data.items.eggs;
  }
}

export default EggState;
