import ItemList from './ItemList';

import Potion from '../Items/Potion';

class PotionList extends ItemList {
  static ItemClass = Potion;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
  }

  static get itemType() {
    return 'Hatching Potion';
  }

  get items() {
    return this.props.store.premiumhatchingpotions;
  }
}

export default PotionList;
