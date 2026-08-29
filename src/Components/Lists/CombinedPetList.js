import ItemList from './ItemList';

import CombinedPetInfo from '../Infos/CombinedPetInfo';
import Pet from '../Items/Pet';

class CombinedPetList extends ItemList {
  static ItemClass = Pet;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
  }

  constructor(props) {
    super(props);
    this.sortKey = 'least';
  }

  get items() {
    const { store, category } = this.props;

    if (!category || !(category in store.pets)) {
      throw new Error('CombinedPetList: category "' + category + '" is invalid');
    }

    return store.pets[category];
  }

  renderItemInfo() {
    return (
      <div class="column">
        {this.infoItem === null ? '' : (
          <CombinedPetInfo item={this.infoItem} />
        )}
      </div>
    );
  }
}

export default CombinedPetList;
