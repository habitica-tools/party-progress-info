import Egg from '../Items/Egg';
import ItemList from './ItemList';

class EggList extends ItemList {
  static type = 'egg';
  static ItemClass = Egg;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
  }

  get items() {
    return this.props.store.eggs[this.props.category];
  }
}

export default EggList;
