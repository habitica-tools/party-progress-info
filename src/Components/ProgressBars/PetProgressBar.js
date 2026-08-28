import ProgressBar from './ProgressBar';

class PetProgressBar extends ProgressBar {
  static defaultProps = {
    category: null,
  }

  static get itemType() {
    return 'Pet';
  }

  get items() {
    const { store, category } = this.props;

    if (!category || !(category in store.pets)) {
      throw new Error('PetProgressBar: category "' + category + '" is invalid');
    }

    return store.pets[category];
  }
}

export default PetProgressBar;
