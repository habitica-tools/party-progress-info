import ItemState from './ItemState';

class PotionState extends ItemState {
  static userItems(user) {
    return user.data.items.hatchingPotions;
  }
}

export default PotionState;
