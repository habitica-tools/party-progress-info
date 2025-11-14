import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import Egg from './Egg';
import EggInfo from './EggInfo';

@observer
class EggList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor info = null;
  @observable accessor sortKey = "2";
  store = null;
  category = "";

  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.category = this.props.category;
  }

  @computed get eggsWithCounts() {
    let eggs = [...this.store.eggsDict[this.category]].map(function (egginfo) {
      let eggdetail = egginfo;
      eggdetail.count = [...this.store.eggsDict[this.category]].filter(([id, egg]) => egg.id === egginfo[0]).reduce((prevVal, [id, egg]) => prevVal + egg.count, 0);
      return eggdetail;
    }, this);

    switch (this.sortKey) {
      case "1":
        eggs.sort(function (a, b) {
          if (a.count < b.count) {
            return -1;
          }
          if (a.count > b.count) {
            return 1;
          }
          return 0;
        })
        break;
      case "2":
        eggs.sort(function (a, b) {
          if (a.count > b.count) {
            return -1;
          }
          if (a.count < b.count) {
            return 1;
          }
          return 0;
        })
        break;
      default:
        break;
    }

    return eggs;
  }


  render() {
    const store = this.props.store;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader"></div>);
    }
    else {
      return (
        <div class="ui fluid container">
          <div class="column stable">
            <div class="ui stackable grid">
              <div class="twelve wide column">
                &nbsp;<br /><br />
              </div>
              <div class="four wide column">
                <span class="dropdown-label">Sort By: </span>
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortEggs}>
                  <option value="">Default</option>
                  <option value="1">Shortage</option>
                  <option value="2">Most</option>
                </select>
              </div>
            </div>
            <div class="item-rows">
              <div class="items">
                {[...this.eggsWithCounts].map(egg =>
                  <Egg id={egg[0]} egg={egg[1]} eggList={this} />
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

  @action sortEggs = (e) => {
    this.sortKey = e.target.value;
  }
};

export default EggList;