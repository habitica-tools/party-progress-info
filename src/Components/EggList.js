import { Component } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import Egg from './Egg';
import EggInfo from './EggInfo';

@observer
class EggList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor info = null;
  @observable accessor sortKey = "most";
  @observable accessor partyOnly = true;

  sort(array, key) {
    switch (key) {
      case "least":
        array.sort((a, b) => a.count - b.count);
        break;
      case "most":
        array.sort((a, b) => b.count - a.count);
        break;
      case "alphabetical":
        array.sort((a, b) => {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        });
    }

    return array;
  }

  render() {
    const store = this.props.store;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader"></div>);
    }
    else {
      let eggs = [...store.eggs[this.props.category]].map(([_, egg]) => egg);
      if (this.partyOnly) eggs = eggs.filter(egg => egg.count > 0);

      eggs = this.sort(eggs, this.sortKey);

      return (
        <div class="ui fluid container">
          <div class="ui stackable grid">
            <div class="twelve wide column">
              <h4 class="ui header">{this.props.category} eggs</h4><br />
            </div>
            <div class="four wide column">
              <span class="dropdown-label">Sort By: </span>
              <select class="ui dropdown" value={this.sortKey} onChange={this.onSortKeyChanged}>
                <option value="default">Default</option>
                <option value="least">Shortage</option>
                <option value="most">Most</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
          <div class="items">
            {eggs.map(egg => <Egg egg={egg} eggList={this} />)}
          </div>
          {
            this.partyOnly
              ? <button class="ui blue button" onClick={this.showAll}><i class="unhide icon"></i>Show All</button>
              : <button class="ui olive button" onClick={this.showPartyOnly}><i class="hide icon"></i>Party Only</button>
          }
          <div>
            {this.info === null ? <br /> : <EggInfo egg={this.info} store={store} eggList={this} />}
          </div>
        </div>
      );
    }
  }

  @action onSortKeyChanged = (e) => {
    this.sortKey = e.target.value;
  }

  @action showAll = () => {
    this.partyOnly = false;
  }

  @action showPartyOnly = () => {
    this.partyOnly = true;
  }

  @action showInfo(egg) {
    if (this.info === egg) {
      this.info = null;
    }
    else {
      this.info = egg;
    }
  }

  @action hideInfo() {
    this.info = null;
  }
};

export default EggList;