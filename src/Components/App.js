import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Settings from './Settings';
import QuestList from './QuestList';
import QuestEggsList from './QuestEggsList';
import PetList from './PetList';
import GearList from './GearList';

@observer
class App extends Component {

  render({store}) {
    return (
      <div>
        <div class="ui fixed inverted menu">
          <div class="ui container">
            <a href="#" class="ui inverted header">
              Habitica Party Progress Info
            </a>
          </div>
        </div>
        <div class="ui main container">
          <div class="ui info ignored message">
            <p>With this tool you can see the nr of pets still needed for a party/user and which quests are in the inventory.</p>
            <p>To get started fill in your own + all Partymembers Habitica userid with below form.</p>
            <p>Get your User ID <a href="https://habitica.com/#/options/settings/api">here</a>. 
            Then get your partymembers UserID's by clicking on their avatar in Habitica.</p>
            <p>Be sure to share the unique url with your party, enjoy!</p>
          </div>                  
          <div class="ui fluid container">
            <Settings store={store}/>
            <div class="ui horizontal divider header">
              <h4>Wanted Quest Pets</h4>
            </div>            
            <PetList store={store}/>
            <br/>
          </div>
          <div class="ui fluid container">
            <div class="ui basic segment"></div>
            <div class="ui two column stackable grid">
              <div class="ui horizontal divider header">
                <h4>Quests Available in the Party</h4>
              </div>
              <QuestList store={store} category="pet"/>
              <br/>
              <QuestList store={store} category="unlockable"/>
              <br/>
              <QuestList store={store} category="gold"/>
            </div>
          </div>          
          <div class="ui fluid container">
            <div class="ui horizontal divider header">
              <h4>Non Hatched Quest Eggs</h4>
            </div>
            <div class="ui basic segment"></div>
            <QuestEggsList store={store}/>
          </div>
          <div class="ui fluid container">
          <div class="ui horizontal divider header">
              <h4>Gear Collection</h4>
            </div>
            <div class="ui basic segment"></div>
            Beware Gears is new there might be dragons or bugs
            <GearList store={store}/>
          </div>
        </div>
        <div class="ui inverted vertical footer segment">
          <div class="ui center aligned container">
            <div class="ui stackable inverted divided grid">
              <div class="three wide column">
                <h4 class="ui inverted header">Code</h4>
                <div class="ui inverted link list">
                  <a href="https://bitbucket.org/pietervanh/habitica-tools"><i class="bitbucket square icon"></i>Git Repository</a>
                </div>
              </div>            
              <div class="three wide column">
                <h4 class="ui inverted header">Copyright</h4>
                <p>Some Assets are linked from <a href="https://habitica.com">HabitRPG</a> which are licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC-BY-NC-SA 3.0</a></p>
              </div>
              <div class="two wide column">
                <h4 class="ui inverted header">Other Info</h4>
                <div class="ui inverted link list">
                <a href="http://habitica.wikia.com/wiki/Party_Progress_Info">Wiki</a>
                </div>
                <div class="two wide column">
                <h4 class="ui inverted header">Related Links</h4>
                <div class="ui inverted link list">
                  <a href="http://habitica.com">Habitica</a>
                  <a href="https://oldgods.net/habitica/cTheDragons/feed.html">Bulk Feed Pets Tool</a>
                  <a href="https://oldgods.net/habitica/cTheDragons/group.html">Party &amp; Guild Data Tool</a>
                </div> 
                </div>               
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

};


export default App;