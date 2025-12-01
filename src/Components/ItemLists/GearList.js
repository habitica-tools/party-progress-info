import Gear from '../Items/Gear';
import ItemList from './ItemList';

class GearList extends ItemList {
  static type = 'Gear';
  static ItemClass = Gear;

  static sortOptions = {
    default: 'Default',
    alphabetical: 'A-Z',
    set: 'Set',
    type: 'Type',
  }

  constructor(props) {
    super(props);

    this.sortKey = 'default';
  }

  get items() {
    return this.props.store.gear;
  }
}

export default GearList;
