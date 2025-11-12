import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import Quest from './Quest';
import QuestInfo from './QuestInfo';

@observer
class QuestList extends Component {
  @observable accessor showAll = false;
  @observable accessor questInfo = null;

  render() {
    const store = this.props.store;
    const category = this.props.category;

    return(
    store.loadingobjects ?  <div class="ui active centered inline loader"></div> :
    <div class="column">
      <h4 class="ui header">{category} quests</h4>
      <div class="items">
      {Array.from(store.quests.entries()
      .filter(([id,quest]) => quest.data.category === category || quest.data.category === "timeTravelers" && quest.data.drop.items[0].type === "eggs")
      .filter(([id,quest]) => this.showAll ? quest : quest.users.length > 0).map(([id, quest]) =>
        <Quest quest={quest} id={id} questlist={this} />
      ))}
      </div>
      {this.showAll ? <button class="ui olive button" onClick={this.handlePartyOnly}><i class="hide icon"></i>Party Only</button> : <button class="ui blue button" onClick={this.handleShowAll}><i class="unhide icon"></i>Show All</button>}
      <div>
        {this.questInfo === null ? <br/> : <QuestInfo quest={this.questInfo} store={store} questlist={this}/>  }
      </div>
      </div>
    );
  }
//{id} {quest.data.text}

  @action handleShowAll = (e) => {
    this.showAll = true;
  }

  @action handlePartyOnly = (e) => {
    this.showAll = false;
  }

  @action showInfo(quest){
    if(this.questInfo === quest){
      this.questInfo = null;
    }
    else{
      this.questInfo = quest;
    }
  }

  @action hideInfo() {
    this.questInfo = null;
  }

};

export default QuestList;