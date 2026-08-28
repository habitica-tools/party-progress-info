import ItemList from './ItemList';

import Quest from '../Items/Quest';

class QuestList extends ItemList {
  static ItemClass = Quest;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
  }

  get items() {
    const { store, category } = this.props

    return store.filteredQuests(category);
  }
}

export default QuestList;
