import ItemList from './ItemList';

import Gear from '../Items/Gear';

class GearList extends ItemList {
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

  static get itemType() {
    return 'Equipment';
  }

  get items() {
    return this.props.store.gear;
  }
}

export default GearList;
