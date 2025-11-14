import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import EggInfo from './EggInfo';

@observer
class BaseEggsList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor eggInfo = null;
  @observable accessor sortKey = "2";
  store = null;

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  @computed get eggsWithCounts() {
    let eggs = [...this.store.baseeggs].map(function (egginfo) {
      let eggdetail = egginfo;
      eggdetail.count = [...this.store.baseeggs].filter(([id, egg]) => egg.id === egginfo[0]).reduce((prevVal, [id, egg]) => prevVal + egg.count, 0);
      return eggdetail;
    }, this).filter(egg => egg.count > 0);

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
      /*
      case "3":
      eggs.sort(function(a,b){
          if(a.id < b.id){
              return -1;
          }
          if(a.id > b.id) {
              return 1;
          }
          return 0;
      })
      break;
      */
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
                  <div>
                    <div class="item-wrapper">
                      <div class="item" data-tooltip={egg[0]}>
                        <span class="badge badge-pill badge-item badge-info badge-count">
                          {egg.count}
                        </span>
                        {egg[1].selectedcount >= 1 ?
                          <span class="badge badge-pill badge-item badge-blue">
                            {egg[1].selectedcount}
                          </span>
                          : ''
                        }
                        <span class={egg[0] === this.eggInfo ? "selectableInventory item-content Egg Pet_Egg_" + egg[0] + "" : "item-content Egg Pet_Egg_" + egg[0] + ""} onClick={this.showEggInfo.bind(this, egg[0])}>
                          <img src={this.imageurl + "Pet_Egg_" + egg[0] + ".png"} alt={egg[0]} />
                        </span>
                      </div>
                      <span class="pettxt">{egg[0]}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="column">
            {this.eggInfo === null ? <br /> :
              <EggInfo category={this.eggInfo} store={store} egglist={this} />
            }
          </div>
        </div>
      );
    }
  }

  @action setEggInfo(category) {
    if (this.eggInfo === category) {
      this.hideEggInfo();
    }
    else {
      this.eggInfo = category;
    }
  }

  showEggInfo = (e) => {
    this.setEggInfo(e);
  }

  @action hideEggInfo() {
    this.setEggInfo(null);
  }

  @action sortEggs = (e) => {
    this.sortKey = e.target.value;
  }

};

export default BaseEggsList;