import ItemList from './ItemList';

import Egg from '../Items/Egg';

class EggList extends ItemList {
  static ItemClass = Egg;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
  }

  get items() {
    const { category } = this.props;
    if (!category || !(category in this.props.store.eggs)) {
      throw new Error('EggList: category "' + category + '" is invalid');
    }

    return this.props.store.eggs[category];
  }
}

export default EggList;
