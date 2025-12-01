import { Component } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class GearLeaderboard extends Component {
  @observable accessor showleaderboard = 'top3';

  render() {
    const { store } = this.props;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader" />);
    }

    return (
      <div class="ui fluid container">
        <div class="column">
          <div class="ui horizontal divider header">
            <h4>Equipment Leaderboard</h4>
          </div>
          <table class="ui celled table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Equipment Count</th>
              </tr>
            </thead>
            <tbody>
              {this.showleaderboard === 'top3' &&
                  store.top3gearleaderboard.map((user, index) => (
                    user.data.profile !== undefined ? (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.data.profile.name}</td>
                        <td>{user.totalGearCount}</td>
                      </tr>
                    ) : (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.id}</td>
                        <td>{user.totalGearCount}</td>
                      </tr>
                    )
                  ))
              }
              {this.showleaderboard === 'all' &&
                  store.gearleaderboard.map((user, index) => (
                    user.data.profile !== undefined ? (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.data.profile.name}</td>
                        <td>{user.totalGearCount}</td>
                      </tr>
                    ) : (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.id}</td>
                        <td>{user.totalGearCount}</td>
                      </tr>
                    )
                  ))
              }
            </tbody>
          </table>
          {this.showleaderboard === 'top3' &&
              <button class="ui blue button" onClick={this.handleLeaderboardShowAll}><i class="unhide icon" />Show All</button>
          }
          {this.showleaderboard === 'all' &&
              <button class="ui olive button" onClick={this.handleLeaderboardTop3Only}><i class="hide icon" />Top 3 Only</button>
          }
        </div>
      </div>
    );
  }

  @action handleLeaderboardShowAll = (e) => {
    this.showleaderboard = 'all';
  }

  @action handleLeaderboardTop3Only = (e) => {
    this.showleaderboard = 'top3';
  }
}

export default GearLeaderboard;
