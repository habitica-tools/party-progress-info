import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Settings from './Settings';
import QuestList from './QuestList';
import QuestEggsList from './QuestEggsList';
import PetList from './PetList';
import GearList from './GearList';
import BackgroundList from './BackgroundList';

@observer
class App extends Component {

  gotoPetsQuestEggs = () => {
    this.props.store.gotoPetsQuestEggs();
  }

  gotoOtherQuests = () => {
    this.props.store.gotoOtherQuests();
  }

  gotoGear = () => {
    this.props.store.gotoGear();
  }

  gotoBackgrounds = () => {
    this.props.store.gotoBackgrounds();
  }  

  gotoAbout = () => {
    this.props.store.gotoAbout();
  }  

  render({store}) {
    return (
      <div>
        <div class="ui stackable inverted pointing menu">
            <a href="#" class="item header" onClick={this.gotoPetsQuestEggs}>
              Habitica Party Progress Info
            </a>
          <a class={store.menupage === "petsquesteggs" ?  "item active" : "item"} onClick={this.gotoPetsQuestEggs}>
            Pets Quest &amp; Eggs
          </a>
          <a class={store.menupage === "otherquests" ?  "item active" : "item"} onClick={this.gotoOtherQuests}>
            Other Quests
          </a>
          <a class={store.menupage === "gear" ?  "item active" : "item"} onClick={this.gotoGear}>
            Equipment
          </a>
          <a class={store.menupage === "backgrounds" ?  "item active" : "item"} onClick={this.gotoBackgrounds}>
            Backgrounds
          </a>          
          <a class={store.menupage === "about" ?  "item active" : "item"} onClick={this.gotoAbout}>
            Help &amp; About
          </a>
        </div>       
        <div class="ui main container">
          {store.menupage === "about" &&   
          <div class="ui fluid container">            
            <div class="ui info message">
            
              <div class="header"><i class="help circle icon"></i>Help</div>
              <p>With this tool you can see the number of pets still needed for a party/user and which pet quests are in the inventory. This tool will also give you an overview of equipment, (backgrounds), and other quests available to user/party.</p>
              <p></p>

              <p>To get started fill in your own + all Partymembers Habitica userid on the form on the other pages</p>
              <p>
                  <ol>
                  <li>Get your User ID <a href="https://habitica.com/user/settings/api">here</a></li>
                  <li>Then get your partymembers UserID's by clicking on their avatar in Habitica.</li>
                  <li>Fill in each User ID + Click Add</li>
                  <li>Save your unique link by bookmarking it so you can revisit the page every time</li>
                  <li>Put your unique link in your party sidebar on Habitica</li>
                  <li>Share the love!</li>
                </ol>
              </p>
            </div>           
            <div class="ui message">
            
            <div class="header"><i class="address card outline icon"></i>Contact</div>
              <p>If you have suggestions for improvement for this tool you can always contact me on Habitica, my UserID = f600354c-9d34-4a4c-a38d-cae52cf58705 with handle @PRoeleert.</p>
              <p>Or you can just say hi to me if you like this tool as well :)</p>
            </div>                     
          </div>   
          } 
          {store.menupage !== "about" &&                       
          <div class="ui fluid container">
            <div class="ui info ignored message">
             <i class="help circle icon"></i>Goto the <a href="#" onClick={this.gotoAbout}>Help About Section</a> for info on how to use this Tool.
            </div>
            <Settings store={store}/>
          </div>
          }
          {store.menupage === "petsquesteggs" &&
          <div class="ui fluid container">            
            <div class="ui horizontal divider header">
              <h4>Wanted Quest Pets</h4>
            </div>            
            <PetList store={store}/>
            <div class="ui basic segment"></div>
            <div class="ui horizontal divider header">
                <h4>Pet Quests Available in the Party</h4>
              </div>
              <QuestList store={store} category="pet"/>
            <div class="ui horizontal divider header">
              <h4>Non Hatched Quest Eggs</h4>
            </div>
            <div class="ui basic segment"></div>
            <QuestEggsList store={store}/>
          </div>
          }
          {store.menupage === "otherquests" &&
          <div class="ui fluid container">
          <div class="ui horizontal divider header">
              <h4>Other Quests in Party</h4>
            </div>
            <div class="ui basic segment"></div>
            <div class="ui two column stackable grid">
              <QuestList store={store} category="unlockable"/>
              <QuestList store={store} category="gold"/>
            </div>
          </div>
          }
          {store.menupage === "gear" &&
          <div class="ui fluid container">
          <div class="ui horizontal divider header">
              <h4>Gear Collection</h4>
            </div>
            <div class="ui basic segment"></div>
            <div class="ui warning message">
              <i class="warning sign icon"></i>
              Beware Gears is new there might be dragons or bugs, if you find some please let me know.
            </div> 
            <GearList store={store}/>
          </div>
          }
          {store.menupage === "backgrounds" &&
          <div class="ui fluid container">
          <div class="ui horizontal divider header">
              <h4>Background Collection</h4>
            </div>
            <div class="ui basic segment"></div>
            <div class="ui negative message">
              <i class="warning sign icon"></i>
              <p>Unfortunately Background information is not publicly available.</p>
              <p>When this changes in the future (hopefully), I'll offcourse show this data as well.</p>
            </div>            
            
          </div>
          }          
        </div>
        <div class="ui inverted vertical footer segment">
          <div class="ui center aligned container">
            <div class="ui stackable inverted divided grid">
              <div class="three wide column">
                <h4 class="ui inverted header">Code</h4>
                <div class="ui inverted link list">
                  <a class="item" href="https://bitbucket.org/pietervanh/habitica-tools"><i class="bitbucket square icon"></i>Git Repository</a>
                </div>
              </div>            
              <div class="three wide column">
                <h4 class="ui inverted header">Copyright</h4>
                <p class="item">Some Assets are linked from <a href="https://habitica.com">HabitRPG</a> which are licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC-BY-NC-SA 3.0</a></p>
              </div>
              <div class="two wide column">
                <h4 class="ui inverted header">Other Info</h4>
                <div class="ui inverted link list">
                  <a class="item" href="http://habitica.wikia.com/wiki/Party_Progress_Info">Wiki</a>
                </div>
              </div>                
              <div class="two wide column">
                <h4 class="ui inverted header">Related Links</h4>
                <div class="ui inverted link list">
                    <a class="item" href="http://habitica.com">Habitica</a>
                    <a class="item" href="https://oldgods.net/habitica/cTheDragons/feed.html">Bulk Feed Pets Tool</a>
                    <a class="item" href="https://oldgods.net/habitica/cTheDragons/group.html">Party &amp; Guild Data Tool</a>
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