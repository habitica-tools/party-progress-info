import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Settings from './Settings';
import QuestList from './QuestList';

@observer
class App extends Component {

  render({store}) {
    return (
      <div class="ui main container">
        <h2 class="ui dividing header">
          Habitica Party Tools
        </h2>
        <div class="ui fluid container">
          <div class="column">
            <Settings store={store}/>
          </div>
          <br/>
          <div class="ui two column stackable grid">
            <div class="ui horizontal divider header">
              <h4>Quests</h4>
            </div>
            <QuestList store={store} category="pet"/>
            <br/>
            <QuestList store={store} category="unlockable"/>
            <br/>
            <QuestList store={store} category="gold"/>
          </div>
        </div>
      </div>
    );
  }

};


export default App;