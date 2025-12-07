import { Component } from 'preact';

import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';

import ItemList from './ItemList';

import Background from '../Items/Background';

class BackgroundList extends ItemList {
  static ItemClass = Background;

  static sortOptions = {
    default: 'Default',
    least: 'Shortage',
    most: 'Most',
    alphabetical: 'A-Z',
    set: 'Set',
  }

  constructor(props) {
    super(props);

    this.sortKey = 'default';
    this.partyOnly = false;
  }

  get items() {
    return this.props.store.backgrounds;
  }

  @action showInfo(item) {
    // do not show an item info for backgrounds
    this.infoItem = null;
  }
}

export default BackgroundList;
