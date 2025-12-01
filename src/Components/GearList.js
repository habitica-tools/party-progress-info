import { Component } from 'preact';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';

import GearInfo from './GearInfo';

@observer
class GearList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor gearInfo = null;
  @observable accessor sortKey = '2';
  @observable accessor showleaderboard = 'top3';
  store = null;

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  @computed get gearWithCounts() {
    const gear = [...this.store.gear].map((gearinfo) => {
      const geardetail = gearinfo[1];
      return geardetail;
    }, this).filter((geari) => geari.count > 0);

    switch (this.sortKey) {
      case '1':
        gear.sort((a, b) => {
          if (a.count < b.count) {
            return -1;
          }
          if (a.count > b.count) {
            return 1;
          }
          return 0;
        })
        break;
      case '2':
        gear.sort((a, b) => {
          if (a.count > b.count) {
            return -1;
          }
          if (a.count < b.count) {
            return 1;
          }
          return 0;
        })
        break;
      case '3':
        gear.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        })
        break;
      case '4':
        gear.sort((a, b) => {
          if (a.data.set < b.data.set) {
            return -1;
          }
          if (a.data.set > b.data.set) {
            return 1;
          }
          return 0;
        })
        break;
      case '5':
        gear.sort((a, b) => {
          if (a.data.type < b.data.type) {
            return -1;
          }
          if (a.data.type > b.data.type) {
            return 1;
          }
          return 0;
        })
        break;

      default:
        break;
    }

    return gear;
  }

  render() {
    const { store } = this.props;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader"></div>);
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
              <button class="ui blue button" onClick={this.handleLeaderboardShowAll}><i class="unhide icon"></i>Show All</button>
          }
          {this.showleaderboard === 'all' &&
              <button class="ui olive button" onClick={this.handleLeaderboardTop3Only}><i class="hide icon"></i>Top 3 Only</button>
          }
        </div>
        <div class="column stable">
          <div class="ui stackable grid">
            <div class="twelve wide column">
                &nbsp;<br /><br />
            </div>
            <div class="four wide column">
              <span class="dropdown-label">Sort By: </span>
              <select class="ui dropdown" value={this.sortKey} onChange={this.sortGear}>
                <option value="">Default</option>
                <option value="1">Shortage</option>
                <option value="2">Most</option>
                <option value="3">A-Z</option>
                <option value="4">Set</option>
                <option value="5">Type</option>
              </select>
            </div>
          </div>
          <div class="item-rows">
            <div class="items">
              {[...this.gearWithCounts].map((gear) => (
                <div>
                  <div class="item-wrapper">
                    <div class="item" data-tooltip={gear.data.text}>
                      <span class="badge badge-pill badge-item badge-info badge-count">
                        {gear.count}
                      </span>
                      {gear.selectedcount < 1 ? '' : (
                        <span class="badge badge-pill badge-item badge-blue">
                          {gear.selectedcount}
                        </span>
                      )}
                      <span class={gear.id === this.gearinfo ? 'selectableInventory item-content Gear' : 'item-content Gear'} onClick={this.showGearInfo.bind(this, gear.id)}>
                        <img src={this.imageurl + 'shop_' + gear.id + '.png'} alt={'shop_' + gear.id} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div class="column">
          {this.gearInfo === null ? <br /> : (
            <GearInfo category={this.gearInfo} store={store} gearlist={this} />
          )}
        </div>
      </div>
    );
  }

  @action setGearInfo(category) {
    if (category === this.gearInfo) {
      this.setGearInfo(null);
    }
    else {
      this.gearInfo = category;
    }
  }

  showGearInfo = (e) => {
    this.setGearInfo(e);
  }

  @action hideGearInfo() {
    this.setGearInfo(null);
  }

  @action sortGear = (e) => {
    this.sortKey = e.target.value;
  }

  @action handleLeaderboardShowAll = (e) => {
    this.showleaderboard = 'all';
  }

  @action handleLeaderboardTop3Only = (e) => {
    this.showleaderboard = 'top3';
  }
}

export default GearList;
