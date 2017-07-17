import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Quest from './Quest'
import _ from 'lodash';
require('preact/devtools');

@observer
class QuestList extends Component {

  render({store}) {

    return(  
    store.loadingobjects ?  "LOADING" :
      <ul>
      {store.quests.entries().map(([id, quest]) =>
        <li>{id} {quest.data.text} {quest.count} </li>
      )}
      </ul>
    );
  }

  handleShowAll = () => {

  }


};


export default QuestList;