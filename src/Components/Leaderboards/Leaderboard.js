import { Component } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class Leaderboard extends Component {
  @observable accessor podiumOnly = true;

  static defaultProps = {
    showPercentage: true,
  }

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

  get usersWithCounts() {
    const { items } = this;
    const { store } = this.props;

    const users = store.users.filter((user) => !user.loading && !user.invalid)

    let usersWithCounts = []
    users.forEach((user) => {
      const count = items.values().reduce((sum, item) => sum + item.userCount(user), 0)
      usersWithCounts.push({ id: user.id, name: user.data.profile.name, count: count });
    });

    usersWithCounts = usersWithCounts.sort((a, b) => b.count - a.count);

    if (this.podiumOnly) {
      usersWithCounts = usersWithCounts.slice(0, 3);
    }

    return usersWithCounts;
  }

  render() {
    const {
      podiumOnly, count, neededCount, usersWithCounts,
    } = this;
    const { itemType } = this.constructor;
    const { showPercentage } = this.props;

    const totalCount = count + neededCount;

    return (
      <div>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>{itemType} Count</th>
              {showPercentage && (
                <th>Percentage</th>
              )}
            </tr>
          </thead>
          <tbody>
            {
              usersWithCounts.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.count}</td>
                  {showPercentage && (
                    <td>{
                      totalCount > 0 ? (
                        parseFloat((user.count / totalCount) * usersWithCounts.length * 100).toFixed(2) + ' %'
                      ) : '0.00 %'
                    }</td>
                  )}
                </tr>
              ))
            }
          </tbody>
        </table>
        {podiumOnly &&
          <button class="ui blue button" onClick={this.showAll}><i class="unhide icon" />Show All</button>
        }
        {!podiumOnly &&
          <button class="ui olive button" onClick={this.showPodiumOnly}><i class="hide icon" />Podium Only</button>
        }
      </div>
    );
  }

  @action showAll = () => {
    this.podiumOnly = false;
  }

  @action showPodiumOnly = () => {
    this.podiumOnly = true;
  }
}

export default Leaderboard;
