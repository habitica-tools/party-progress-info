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
        <button class={"inventory_quest_scroll_" + id}>
          <div class="badge badge-info stack-count">
            {quest.count}
          </div>
          </button>
      )}
      </ul>
    );
  }
//{id} {quest.data.text}  
//filter bosses
  handleShowAll = () => {

  }


};


export default QuestList;