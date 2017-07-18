import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action } from 'mobx';
import Quest from './Quest'
import QuestInfo from './QuestInfo'
import _ from 'lodash';
require('preact/devtools');

@observer
class QuestList extends Component {
  @observable showAll = false;
  @observable questInfo = null;

  render({store, category},{showAll, questInfo}) {

    return(  
    store.loadingobjects ?  "LOADING" :
    <div>
      <menu class="pets-menu">
      {store.quests.entries().filter(([id,quest]) => quest.data.category === category).filter(([id,quest]) => this.showAll ? quest : quest.users.length > 0).map(([id, quest]) =>
        <Quest quest={quest} id={id} questlist={this} />
      )}
      </menu>
      {this.showAll ? <button onClick={this.handlePartyOnly}>Party Only</button> : <button onClick={this.handleShowAll}>Show All</button>}
      <div>
        {this.questInfo === null ? <br/> : <QuestInfo quest={this.questInfo}/>  }
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
    this.questInfo = quest;
  }

};

export default QuestList;