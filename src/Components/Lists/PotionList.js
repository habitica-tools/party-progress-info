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
    const { category } = this.props;
    if (!category || !(category in this.props.store.potions)) {
      throw new Error('PotionList: category "' + category + '" is invalid');
    }

    return this.props.store.potions[this.props.category];
  }
}

export default PotionList;
