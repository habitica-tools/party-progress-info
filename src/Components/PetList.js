import { Component } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import CombinedPetList from './Lists/CombinedPetList';

@observer
class PetList extends Component {
  @observable accessor showleaderboard = 'top3';
  store = null;

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  render() {
    const { store } = this.props;

    if (store.loadingObjects) {
      return (<div class="ui active centered inline loader" />);
    }

    const totalpercentage = store.totalCountPetsParty > 0 ? parseFloat(store.totalCountPetsParty / (store.totalCountPets / 100)).toFixed(2) : '0'

    return (
      <div>
        <div class="column">
          <div class="progress-container-big">
            <div class="progress">
              <div class="progress-bar bg-experience" style={'transition-duration: 300ms; width:' + totalpercentage + '%;'} />
            </div>
          </div>
        </div>
        <div class="ui four statistics">
          <div class="ui tiny statistic">
            <div class="value got">
              {totalpercentage + ' %'}
            </div>
            <div class="label">
              Pets Collected %
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value got">
              {store.totalCountPetsParty}
            </div>
            <div class="label">
              Pets in Party
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value wanted">
              {store.totalNeededPetsParty}
            </div>
            <div class="label">
              Pets Wanted
            </div>
          </div>
          <div class="ui tiny statistic">
            <div class="value">
              {store.totalCountPets}
            </div>
            <div class="label">
              Total Pets
            </div>
          </div>
        </div>
        <CombinedPetList store={store} category="quest" filterable={false} />
        <div class="column">
          <div class="ui horizontal divider header">
            <h4>Quest Pet Leaderboard</h4>
          </div>
          <table class="ui celled table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Pet Count</th>
                <th>Percentage of Total</th>
              </tr>
            </thead>
            <tbody>
              {this.showleaderboard === 'top3' &&
                store.top3petleaderboard.filter((u) => !u.invalid).map((user, index) => (
                  user.data.profile !== undefined ? (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.data.profile.name}</td>
                      <td>{user.totalPetCount}</td>
                      <td>{store.totalCountPetsParty > 0 ? parseFloat(user.totalPetCount / (store.totalCountPets / 100)).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                  ) : (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.totalPetCount}</td>
                      <td>{store.totalCountPetsParty > 0 ? parseFloat(user.totalPetCount / (store.totalCountPets / 100)).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                  )
                ))
              }
              {this.showleaderboard === 'all' &&
                store.petleaderboard.filter((u) => !u.invalid).map((user, index) => (
                  user.data.profile !== undefined ? (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.data.profile.name}</td>
                      <td>{user.totalPetCount}</td>
                      <td>{store.totalCountPetsParty > 0 ? parseFloat(user.totalPetCount / (store.totalCountPets / 100)).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                  ) : (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.totalPetCount}</td>
                      <td>{store.totalCountPetsParty > 0 ? parseFloat(user.totalPetCount / (store.totalCountPets / 100)).toFixed(2) + '%' : '0%'}</td>
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

export default PetList;
