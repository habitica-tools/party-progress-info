import { Component } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class PetLeaderBoard extends Component {
  @observable accessor podiumOnly = true;

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

  get usersWithCounts() {
    const { pets } = this;
    const { store } = this.props;

    const users = store.users.filter((user) => !user.loading && !user.invalid)

    let usersWithCounts = []
    users.forEach((user) => {
      const count = pets.values().reduce((sum, pet) => sum + pet.userCount(user), 0)
      usersWithCounts.push({ id: user.id, name: user.data.profile.name, count: count });
    });

    usersWithCounts = usersWithCounts.sort((a, b) => b.count - a.count);

    if (this.podiumOnly) {
      usersWithCounts = usersWithCounts.slice(0, 3);
    }

    return usersWithCounts;
  }

  render() {
    const { count, neededCount, usersWithCounts } = this;

    const totalCount = count + neededCount;

    return (
      <div>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Pet Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {
              usersWithCounts.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.count}</td>
                  <td>{
                    totalCount > 0 ? (
                      parseFloat((user.count / totalCount) * usersWithCounts.length * 100).toFixed(2) + ' %'
                    ) : '0.00 %'
                  }</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {this.podiumOnly &&
          <button class="ui blue button" onClick={this.showAll}><i class="unhide icon" />Show All</button>
        }
        {!this.podiumOnly &&
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

export default PetLeaderBoard;
