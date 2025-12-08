import ItemState from './ItemState';

class EggState extends ItemState {
  static userItems(user) {
    return user.data.items.eggs;
  }

  get mountTooltip() {
    return this.data.mountText;
  }
}

export default EggState;
