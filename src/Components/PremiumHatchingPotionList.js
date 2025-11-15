import { Component } from 'preact';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';

import HatchingPotionInfo from './HatchingPotionInfo';

@observer
class PremiumHatchingPotionList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor potionInfo = null;
  @observable accessor sortKey = '2';
  store = null;

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  @computed get potionsWithCounts() {
    let potions = [...this.store.premiumhatchingpotions].map(function (potioninfo) {
      let potiondetail = potioninfo;
      potiondetail.count = [...this.store.premiumhatchingpotions].filter(([id, potion]) => potion.id === potioninfo[0]).reduce((prevVal, [id, potion]) => prevVal + potion.count, 0);
      return potiondetail;
    }, this).filter(potion => potion.count > 0);

    switch (this.sortKey) {
      case '1':
        potions.sort(function (a, b) {
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
        potions.sort(function (a, b) {
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

    return potions;
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
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortPotions}>
                  <option value="">Default</option>
                  <option value="1">Shortage</option>
                  <option value="2">Most</option>
                </select>
              </div>
            </div>
            <div class="item-rows">
              <div class="items">
                {[...this.potionsWithCounts].map(potion =>
                  <div>
                    <div class="item-wrapper">
                      <div class="item" data-tooltip={potion[0]}>
                        <span class="badge badge-pill badge-item badge-info badge-count">
                          {potion.count}
                        </span>
                        {potion[1].selectedcount >= 1 ?
                          <span class="badge badge-pill badge-item badge-blue">
                            {potion[1].selectedcount}
                          </span>
                          : ''
                        }
                        <span class={potion[0] === this.potionInfo ? 'selectableInventory item-content HatchingPotion Pet_HatchingPotion_' + potion[0] + '' : 'item-content Egg Pet_Egg_' + potion[0] + ''} onClick={this.showPotionInfo.bind(this, potion[0])}>
                          <img src={this.imageurl + 'Pet_HatchingPotion_' + potion[0] + '.png'} alt={potion[0]} />
                        </span>
                      </div>
                      <span class="pettxt">{potion[0]}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="column">
            {this.potionInfo === null ? <br /> :
              <HatchingPotionInfo category={this.potionInfo} store={store} potionlist={this} />
            }
          </div>
        </div>
      );
    }
  }

  @action setPotionInfo(category) {
    if (this.potionInfo === category) {
      this.hidePotionInfo();
    }
    else {
      this.potionInfo = category;
    }
  }

  showPotionInfo = (e) => {
    this.setPotionInfo(e);
  }

  @action hidePotionInfo() {
    this.setPotionInfo(null);
  }

  @action sortPotions = (e) => {
    this.sortKey = e.target.value;
  }

};

export default PremiumHatchingPotionList;