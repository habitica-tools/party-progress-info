import { Component } from 'preact';

import { observer } from 'mobx-react';

@observer
class PetProgressBar extends Component {
  get pets() {
    const { store, category } = this.props;

    if (!category || !(category in store.pets)) {
      throw new Error('PetProgressBar: category "' + category + '" is invalid');
    }

    return store.pets[category];
  }

  get count() {
    const { pets } = this;

    return pets.values().reduce((sum, pet) => sum + pet.count, 0);
  }

  get neededCount() {
    const { pets } = this;

    return pets.values().reduce((sum, pet) => sum + pet.neededCount, 0);
  }

  render() {
    const { count, neededCount } = this;

    const totalCount = count + neededCount;
    const percentage = totalCount > 0 ? parseFloat((count / totalCount) * 100).toFixed(2) : '0.00';

    return (
      <div>
        <div class="column">
          <div class="progress-container-big">
            <div class="progress">
              <div class="progress-bar bg-experience" style={'transition-duration: 300ms; width:' + percentage + '%;'} />
            </div>
          </div>
        </div>
        <div class="ui four statistics">
          <div class="ui tiny statistic">
            <div class="value got">
              {percentage + ' %'}
            </div>
            <div class="label">
              Pets Collected %
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value got">
              {count}
            </div>
            <div class="label">
              Pets in Party
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value wanted">
              {neededCount}
            </div>
            <div class="label">
              Pets Wanted
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value">
              {totalCount}
            </div>
            <div class="label">
              Total Pets
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PetProgressBar;
