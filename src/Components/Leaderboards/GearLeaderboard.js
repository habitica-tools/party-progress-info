import Leaderboard from './Leaderboard';

class GearLeaderboard extends Leaderboard {
  static defaultProps = {
    showPercentage: false,
  }

  static get itemType() {
    return 'Equipment';
  }

  get items() {
    return this.props.store.gear;
  }
}

export default GearLeaderboard;
