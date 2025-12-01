import { Component, createElement } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import ItemInfo from '../ItemInfo';

function sort(array, key) {
  switch (key) {
    case 'least':
      array.sort((a, b) => a.count - b.count);
      break;
    case 'most':
      array.sort((a, b) => b.count - a.count);
      break;
    case 'alphabetical':
      array.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });
      break;
    case 'set':
      array.sort((a, b) => {
        if (a.data.set < b.data.set) return -1;
        if (a.data.set > b.data.set) return 1;
        return 0;
      });
      break;
    case 'type':
      array.sort((a, b) => {
        if (a.data.type < b.data.type) return -1;
        if (a.data.type > b.data.type) return 1;
        return 0;
      });
      break;
    default:
  }

  return array;
}

function beautifyCategory(category) {
  const string = category.replace(/([A-Z])/g, ' $1').trim();

  return string.charAt(0).toUpperCase() + string.slice(1);
}

@observer
class ItemList extends Component {
  @observable accessor infoItem = null;
  @observable accessor sortKey = 'most';
  @observable accessor partyOnly = true;

  static defaultProps = {
    category: '',
    sortable: true,
  }

  static ItemClass = null;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
    set: 'Set',
    type: 'Type',
  }

  static get itemType() {
    return this.ItemClass.name;
  }

  // eslint-disable-next-line class-methods-use-this
  get items() {
    throw new Error('NotImplementedError: subclasses must implement userItems');
  }

  render() {
    const { store, category, sortable } = this.props;

    if (store.loadingobjects) {
      return (<div class="ui active centered inline loader" />);
    }

    let items = [...this.items].map(([_, item]) => item);
    if (this.partyOnly) items = items.filter((item) => item.count > 0);

    items = sort(items, this.sortKey);

    return (
      <div class="ui fluid container">
        <div class="ui stackable grid">
          <div class="twelve wide column">
            <h4 class="ui header">{beautifyCategory(category)} {this.constructor.itemType + 's'}</h4>
            <br />
          </div>
          {sortable && (
            <div class="four wide column">
              <span class="dropdown-label">Sort By: </span>
              <select class="ui dropdown" value={this.sortKey} onChange={this.onSortKeyChanged}>
                {Object.entries(this.constructor.sortOptions)
                  .map(([key, label]) => (
                    <option value={key}>{label}</option>
                  ))
                }
              </select>
            </div>
          )}
        </div>
        <div class="items">
          {items.map((item) => createElement(this.constructor.ItemClass, { item: item, itemList: this }))}
        </div>
        {
          this.partyOnly ? (
            <button class="ui blue button" onClick={this.showAll}><i class="unhide icon" />Show All</button>
          ) : (
            <button class="ui olive button" onClick={this.showPartyOnly}><i class="hide icon" />Party Only</button>
          )
        }
        <div>
          {this.infoItem === null ? '' : (
            <ItemInfo item={this.infoItem} itemList={this} />
          )}
        </div>
      </div>
    );
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

  @action showInfo(item) {
    if (this.infoItem === item) {
      this.infoItem = null;
    }
    else {
      this.infoItem = item;
    }
  }

  @action hideInfo() {
    this.infoItem = null;
  }
}

export default ItemList;
