import { Component } from 'preact';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';

import BackgroundInfo from './BackgroundInfo';

@observer
class BackgroundList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable accessor showAll = false;
  @observable accessor backgroundInfo = null;
  @observable accessor sortKey = '';
  store = null;

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  @computed get backgroundsWithCounts() {
    const backgrounds = [...this.store.backgrounds].map(function (background) {
      const backgroundDetail = background[1];
      return backgroundDetail;
    }, this);

    switch (this.sortKey) {
      case '1':
        backgrounds.sort(function (a, b) {
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
        backgrounds.sort(function (a, b) {
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
        backgrounds.sort(function (a, b) {
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
        backgrounds.sort(function (a, b) {
          if (a.data.set < b.data.set) {
            return -1;
          }
          if (a.data.set > b.data.set) {
            return 1;
          }
          return 0;
        })
        break;
      default:
        break;
    }

    return backgrounds;
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
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortBackground}>
                  <option value="">Default</option>
                  <option value="1">Shortage</option>
                  <option value="2">Most</option>
                  <option value="3">A-Z</option>
                  <option value="4">Set</option>
                </select>
              </div>
            </div>
            <div class="item-rows">
              <div class="items backgrounds">
                {[...this.backgroundsWithCounts].map(background =>
                  <div>
                    <div class="item-wrapper">
                      <div class="item">
                        <span class="badge badge-pill badge-item badge-info badge-count">
                          {background.count}
                        </span>
                        <span class={background.id === this.backgroundInfo ? 'selectableInventory item-content Background' : 'item-content Background'} onClick={this.showBackgroundInfo.bind(this, background.id)}>
                          <img src={this.imageurl + 'background_' + background.id + '.png'} alt={'shop_' + background.id} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="column">
            {this.backgroundInfo === null ? <br /> :
              <BackgroundInfo category={this.backgroundInfo} store={store} backgroundlist={this} />
            }
          </div>
        </div>
      );
    }
  }

  @action setBackgroundInfo(category) {
    if (category === this.backgroundInfo) {
      this.setBackgroundInfo(null);
    }
    else {
      this.backgroundInfo = category;
    }
  }

  showBackgroundInfo = (e) => {
    this.setBackgroundInfo(e);
  }

  @action hideBackgroundInfo() {
    this.setBackgroundInfo(null);
  }

  @action sortBackground = (e) => {
    this.sortKey = e.target.value;
  }

};

export default BackgroundList;