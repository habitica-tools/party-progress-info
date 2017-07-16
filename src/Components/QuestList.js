import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Quest from './Quest'
require('preact/devtools');

@observer
class QuestList extends Component {

  mapObject(object, callback) {
    return Object.keys(object).map(function (key) {
      return callback(key, object[key]);
    });
  }

  render({common, loading}) {
    if(common.quests !== undefined && !loading)
    {
      return "HAVE QUESTS"
    }
    else{
      if(loading){
        return "LOADING"
      }
      else{
        return "ERROR"
      }
    }
  }

};


export default QuestList;