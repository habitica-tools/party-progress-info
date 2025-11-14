import { Component } from 'preact';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import Egg from './Egg';
import EggInfo from './EggInfo';

@observer
class EggList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor info = null;
  @observable accessor sortKey = "most";

  sort(array, key) {
    switch (key) {
      case "least":
        array.sort((a, b) => a.count - b.count);
        break;
      case "most":
        array.sort((a, b) => b.count - a.count);
        break;
    }

    return array;
  }

  render() {
    const store = this.props.store;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader"></div>);
    }
    else {
      let eggs = [...store.eggsDict[this.props.category]].map(([_, egg]) => egg);

      eggs = this.sort(eggs, this.sortKey);

      return (
        <div class="ui fluid container">
          <div class="column stable">
            <div class="ui stackable grid">
              <div class="twelve wide column">
                &nbsp;<br /><br />
              </div>
              <div class="four wide column">
                <span class="dropdown-label">Sort By: </span>
                <select class="ui dropdown" value={this.sortKey} onChange={this.onSortKeyChanged}>
                  <option value="default">Default</option>
                  <option value="least">Shortage</option>
                  <option value="most">Most</option>
                </select>
              </div>
            </div>
            <div class="item-rows">
              <div class="items">
                {eggs.map(egg =>
                  <Egg egg={egg} eggList={this} />
                )}
              </div>
            </div>
          </div>
          <div class="column">
            {this.info === null ? <br /> :
              <EggInfo egg={this.info} store={store} eggList={this} />
            }
          </div>
        </div>
      );
    }
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

  @action onSortKeyChanged = (e) => {
    this.sortKey = e.target.value;
  }
};

export default EggList;