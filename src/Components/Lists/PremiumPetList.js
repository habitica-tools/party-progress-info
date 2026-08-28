import CombinedPetList from './CombinedPetList';

import CombinedPetInfo from '../Infos/CombinedPetInfo';
import Pet from '../Items/Pet';

class PremiumPetList extends CombinedPetList {
  static ItemClass = Pet;

  static defaultProps = {
    questObtainable: null,
  }

  constructor(props) {
    if (!('category' in props) || props.category !== 'premium') {
      throw new Error('PremiumPetList: category must be "premium"');
    }
    if (!('questObtainable' in props) || typeof props.questObtainable !== 'boolean') {
      throw new Error('PremiumPetList: questObtainable must be a boolean value');
    }

    super(props);
  }

  get items() {
    const { store, questObtainable } = this.props;

    const hatchingPotionQuests = store.filteredQuests('hatchingPotion');
    const questObtainableHatchingPotions = Array.from(hatchingPotionQuests.map(([_, quest]) => quest.data.drop.items[0].key));

    const items = super.items;

    return items.entries().filter(([key, _]) => questObtainable === questObtainableHatchingPotions.includes(key))
  }
}

export default PremiumPetList;
