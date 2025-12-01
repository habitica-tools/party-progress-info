import { Component } from 'preact';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';

import PetInfo from './PetInfo';

@observer
class PetList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor petInfo = null;
  @observable accessor sortKey = '1';
  @observable accessor showleaderboard = 'top3';
  store = null;

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  @computed get petCategoriesWithCounts() {
    const pets = [...this.store.petCategories].map((category) => {
      const petdetail = { id: category };
      const categorypets = [...this.store.pets].filter(([id, pet]) => pet.basetype === category);
      petdetail.needed = categorypets.reduce((prevVal, [id, pet]) => prevVal + pet.needed, 0);
      petdetail.count = categorypets.reduce((prevVal, [id, pet]) => prevVal + pet.count, 0);
      petdetail.selectedcount = categorypets.reduce((prevVal, [id, pet]) => prevVal + pet.selectedcount, 0);
      return petdetail;
    }, this);

    switch (this.sortKey) {
      case '1':
        pets.sort((a, b) => {
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
        pets.sort((a, b) => {
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
        pets.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        })
        break;
      default:
        break;
    }

    return pets;
  }

  render() {
    const { store } = this.props;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader" />);
    }

    const totalpercentage = store.totalCountPetsParty > 0 ? parseFloat(store.totalCountPetsParty / (store.totalCountPets / 100)).toFixed(2) : '0'

    return (
      <div>
        <div class="ui stackable grid">
          <div class="twelve wide column">
            <div class="progress-container-big">
              <div class="progress">
                <div class="progress-bar bg-experience" style={'transition-duration: 300ms; width:' + totalpercentage + '%;'} />
              </div>
            </div>
          </div>
          <div class="four wide column">
            <span class="dropdown-label">Sort By: </span>
            <select class="ui dropdown" value={this.sortKey} onChange={this.sortPets}>
              <option value="">Default</option>
              <option value="1">Shortage</option>
              <option value="2">Most</option>
              <option value="3">A-Z</option>
            </select>
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
        <div class="ui basic segment" />
        <div class="item-rows">
          <div class="items">
            {[...this.petCategoriesWithCounts].map((category) => (
              <div>
                <div class="item-wrapper">
                  <div class="item">
                    <span class="badge badge-pill badge-item badge-count2">
                      {category.needed}
                    </span>
                    <span class="badge badge-pill badge-item badge-count">
                      {category.count}
                    </span>
                    {category.selectedcount < 1 ? '' : (
                      <span class="badge badge-pill badge-item badge-blue">
                        {category.selectedcount}
                      </span>
                    )}
                    <span class={category.id === this.petInfo ? 'selectableInventory item-content Pet Pet-' + category.id + '-Base ' : 'item-content Pet Pet-' + category.id + '-Base '} onClick={this.showPetInfo.bind(this, category.id)}>
                      <img src={this.imageurl + 'Pet-' + category.id + '-Base.png'} alt={category.id} />
                    </span>
                  </div>
                  <span class="pettxt">{category.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="column">
          {this.petInfo === null ? <br /> : (
            <PetInfo category={this.petInfo} store={store} />
          )}
        </div>
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

  @action setPetInfo(category) {
    if (this.petInfo === category) {
      this.petInfo = null;
    }
    else {
      this.petInfo = category;
    }
  }

  showPetInfo = (e) => {
    this.setPetInfo(e);
  }

  @action sortPets = (e) => {
    this.sortKey = e.target.value;
  }

  @action handleLeaderboardShowAll = (e) => {
    this.showleaderboard = 'all';
  }

  @action handleLeaderboardTop3Only = (e) => {
    this.showleaderboard = 'top3';
  }
}

export default PetList;
