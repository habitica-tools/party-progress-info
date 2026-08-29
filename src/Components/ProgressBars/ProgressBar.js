import { Component } from 'preact';

import { observer } from 'mobx-react';

@observer
class ProgressBar extends Component {
  static get itemType() {
    throw new Error('NotImplementedError: subclasses must implement itemType');
  }

  // eslint-disable-next-line class-methods-use-this
  get items() {
    throw new Error('NotImplementedError: subclasses must implement items');
  }

  get count() {
    const { items } = this;

    return items.values().reduce((sum, item) => sum + item.count, 0);
  }

  get neededCount() {
    const { items } = this;

    return items.values().reduce((sum, item) => sum + item.neededCount, 0);
  }

  render() {
    const { itemType } = this.constructor;
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
              {itemType}s Collected %
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value got">
              {count}
            </div>
            <div class="label">
              {itemType}s in Party
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value wanted">
              {neededCount}
            </div>
            <div class="label">
              {itemType}s Wanted
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value">
              {totalCount}
            </div>
            <div class="label">
              Total {itemType}s
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
