import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Settings from './Settings';
import QuestList from './QuestList';

@observer
class App extends Component {

  render({store}) {
    return (
      <div>
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
        <br/>
        </div>
        <div class="ui inverted vertical footer segment">
          <div class="ui container">
            <div class="three wide column">
              <h4 class="ui inverted header">About</h4>
              <div class="ui inverted link list">
                <a href="https://github.com/pietervanh">My Github Profile</a>
              </div>
            </div>            
            <div class="seven wide column">
              <h4 class="ui inverted header">Copyright</h4>
              <p>Some Assets are linked from <a href="https://habitica.com">HabitRPG</a> which are licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC-BY-NC-SA 3.0</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

};


export default App;