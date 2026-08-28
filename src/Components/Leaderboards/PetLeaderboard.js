import Leaderboard from './Leaderboard';

class PetLeaderboard extends Leaderboard {
  static defaultProps = {
    category: null,
    showPercentage: true,
  }

  static get itemType() {
    return 'Pet';
  }

  get items() {
    const { store, category } = this.props;

    if (!category || !(category in store.pets)) {
      throw new Error('PetLeaderboard: category "' + category + '" is invalid');
    }

    return store.pets[category];
  }
}

export default PetLeaderboard;
