import ItemState from './ItemState';

class PotionState extends ItemState {
  static type = 'HatchingPotion';

  static userItems(user) {
    return user.data.items.hatchingPotions;
  }

  get tooltip() {
    return this.data.text;
  }
}

export default PotionState;
