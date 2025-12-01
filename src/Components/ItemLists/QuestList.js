import ItemList from './ItemList';

import Quest from '../Items/Quest';

class QuestList extends ItemList {
  static type = 'quest';
  static ItemClass = Quest;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
  }

  get items() {
    return this.props.store.quests.entries().filter(this.categoryFilter);
  }

  categoryFilter = ([_, quest]) => {
    if (quest.data.category === this.props.category) {
      return true;
    }

    if (quest.data.category === 'timeTravelers') {
      return (
        (this.props.category === 'pet' && quest.data.drop.items[0].type === 'eggs')
        || (this.props.category === 'hatchingPotion' && quest.data.drop.items[0].type === 'hatchingPotions')
      );
    }

    return false;
  }
}

export default QuestList;
