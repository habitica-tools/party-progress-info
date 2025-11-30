import { Component } from 'preact';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import Quest from './Quest';
import QuestInfo from './QuestInfo';

@observer
class QuestList extends Component {
  @observable accessor showAll = false;
  @observable accessor questInfo = null;

  render() {
    const { store, category } = this.props;

    return (
      store.loadingobjects ? <div class="ui active centered inline loader" /> : (
        <div class="column">
          <h4 class="ui header">{category} quests</h4>
          <div class="items">
            {Array.from(
              store.quests.entries().filter(this.categoryFilter)
                .filter(([_, quest]) => (this.showAll ? quest : quest.users.length > 0))
                .map(([id, quest]) => (
                  <Quest quest={quest} questList={this} />
                )),
            )}
          </div>
          {this.showAll ? (
            <button class="ui olive button" onClick={this.handlePartyOnly}><i class="hide icon" />Party Only</button>
          ) : (
            <button class="ui blue button" onClick={this.handleShowAll}><i class="unhide icon" />Show All</button>
          )}
          <div>
            {this.questInfo === null ? <br /> : (
              <QuestInfo quest={this.questInfo} store={store} questlist={this} />
            )}
          </div>
        </div>
      )
    );
  }

  categoryFilter = ([_, quest]) => {
    if (quest.data.category === this.props.category) {
      return true;
    }

    if (quest.data.category === 'timeTravelers') {
      return (
        (this.props.category === 'pet' && quest.data.drop.items[0].type === 'eggs')
        || (this.props.category === 'hatchingPotion' && quest.data.drop.items[0].type === 'hatchingPotions')
      );
    }

    return false;
  }

  @action handleShowAll = (e) => {
    this.showAll = true;
  }

  @action handlePartyOnly = (e) => {
    this.showAll = false;
  }

  @action showInfo(quest) {
    if (this.questInfo === quest) {
      this.questInfo = null;
    }
    else {
      this.questInfo = quest;
    }
  }

  @action hideInfo() {
    this.questInfo = null;
  }
}

export default QuestList;
