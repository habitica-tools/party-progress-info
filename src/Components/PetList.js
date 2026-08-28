import { Component } from 'preact';

import { observer } from 'mobx-react';

import CombinedPetList from './Lists/CombinedPetList';
import PetLeaderBoard from './PetLeaderBoard';
import PetProgressBar from './PetProgressBar';

@observer
class PetList extends Component {
  render() {
    const { store } = this.props;

    if (store.loadingObjects) {
      return (<div class="ui active centered inline loader" />);
    }

    return (
      <div>
        <PetProgressBar store={store} category="quest" />
        <CombinedPetList store={store} category="quest" filterable={false} />
        <PetLeaderBoard store={store} category="quest" />
      </div>
    );
  }
}

export default PetList;
