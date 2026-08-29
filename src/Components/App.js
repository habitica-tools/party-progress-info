import { Component } from 'preact';
import { observer } from 'mobx-react';

import AuthenticationModal from './AuthenticationModal';
import UserList from './Users/UserList';

import BackgroundList from './Lists/BackgroundList';
import CombinedPetList from './Lists/CombinedPetList';
import EggList from './Lists/EggList';
import GearList from './Lists/GearList';
import PotionList from './Lists/PotionList';
import PremiumPetList from './Lists/PremiumPetList';
import QuestList from './Lists/QuestList';

import GearLeaderboard from './Leaderboards/GearLeaderboard';
import PetLeaderboard from './Leaderboards/PetLeaderboard';

import PetProgressBar from './ProgressBars/PetProgressBar';

@observer
class App extends Component {
  setPageQuestPets = () => {
    this.props.store.setPage('questPets');
  }

  setPageDropPets = () => {
    this.props.store.setPage('dropPets');
  }

  setPagePremiumPets = () => {
    this.props.store.setPage('premiumPets');
  }

  setPageGear = () => {
    this.props.store.setPage('gear');
  }

  setPageOtherQuests = () => {
    this.props.store.setPage('otherQuests');
  }

  setPageBackgrounds = () => {
    this.props.store.setPage('backgrounds');
  }

  setPageAbout = () => {
    this.props.store.setPage('about');
  }

  clearCache = () => {
    this.props.store.clearCache();
    window.location.reload();
  }

  render() {
    const { store } = this.props;

    return (
      <div>
        <div class="ui stackable inverted pointing menu">
          <a href="#" class="item header" onClick={this.gotoPetsQuestEggs}>
            Habitica Party Progress Info
          </a>
          <a class={store.currentPage === 'questPets' ? 'item active' : 'item'} onClick={this.setPageQuestPets}>
            Quest Pets
          </a>
          <a class={store.currentPage === 'premiumPets' ? 'item active' : 'item'} onClick={this.setPagePremiumPets}>
            Magic Potion Pets
          </a>
          <a class={store.currentPage === 'dropPets' ? 'item active' : 'item'} onClick={this.setPageDropPets}>
            Standard Pets
          </a>
          <a class={store.currentPage === 'gear' ? 'item active' : 'item'} onClick={this.setPageGear}>
            Equipment
          </a>
          <a class={store.currentPage === 'otherQuests' ? 'item active' : 'item'} onClick={this.setPageOtherQuests}>
            Other Quests
          </a>
          <a class={store.currentPage === 'backgrounds' ? 'item active' : 'item'} onClick={this.setPageBackgrounds}>
            Backgrounds
          </a>
          <a class={store.currentPage === 'about' ? 'item active' : 'item'} onClick={this.setPageAbout}>
            Help &amp; About
          </a>
        </div>
        <div class="ui main container">
          {store.currentPage === 'about' &&
            <div class="ui fluid container">
              <div class="ui info message">

                <div class="header"><i class="help circle icon" />Help</div>
                <p>
                  The <b>Habitica Party Progress Info</b> tool analyses the pets and inventory of a party or a group of users.<br />
                  With this information it will show the number of pets still needed for the group and which corresponding quests are in the inventories.<br />
                  This tool will also give an overview of owned equipments and backgrounds.
                </p>
                <p />
                <p>
                  When you open the tool it will ask you for your authentication - insert your User ID and API Token.<br />
                  They can be found in your <a href="https://habitica.com/user/settings/siteData">Habitica profile</a> under <code>User -&gt; Settings -&gt; Site Data</code>.<br />
                  This will automatically add you as one of the users whose pets and inventory are evaluated by the tool.
                </p>
                <p>Note: <i>The app will not store your API Token in any way. It is only used for the requests to the Habitica API to retrieve the user data.</i></p>

                <h3>Managing users individually</h3>
                <p>
                  To add additional users, enter their User IDs into the form on the other pages and click the 'Add' button.<br />
                  The tool will download the information about this user using your authentication and include them in the calculations for needed pets.<br />
                  All users are shown in the tool and can be individually removed. Selecting a user or a subgroup of users highlights their status in all evaluations.
                </p>
                <h4>Finding User IDs</h4>
                <p>
                  You can get the User ID of another by opening their profile in Habitica and checking the URL in the address bar of your browser.<br />
                  The User ID is the part after <code>/profile/</code> and looks like this: <code>b477462a-5bb5-4040-9505-f0b049b4f0bb</code>.
                </p>
                <h4>Sharing your collection of users</h4>
                <p>
                  When you add a user to the tool, their User ID will appear in the URL after <code>/?users=...</code> and each User ID is separated by a "|" character.<br />
                  If you reload the page or reopen the same URL later on, the tool will take the User IDs from URL and add all users to your overview.<br />
                </p>
                <p>
                  This way you can
                  <ul>
                    <li>save your unique link to your bookmarks and revisit every time without having to add all users again</li>
                    <li>or share the link with your friends so everybody can have a look at your specific group of users.</li>
                  </ul>
                </p>

                <h3>Adding your party to the tool</h3>
                <p>If you want to add your party but don't want to do enter each User ID individually, there are two ways to add all users from your party:</p>
                <h4>Using the 'Add Party' button next to the 'Add' button.</h4>
                <p>
                  The tool will use your authentication to ask the Habitica API for all users in your party and add them all.<br />
                  This might take a little time since the number of request to the Habitica API per minute is limited.
                </p>
                <h4>Using the special party URL for the tool</h4>
                <p>
                  In the newer version of the tool, you can add <code>/?party</code> to the URL: <a href="https://habitica-tools.github.io/party-progress-info/?party">https://habitica-tools.github.io/party-progress-info/?party</a><br />
                  This will tell the tool to directly retrieve your party directly after you entered your authentication.
                </p>
                <p>
                  This feature has one crucial advantage over the approach of saving a link with a fixed list of users for your party:<br />
                  If members join or leave your party, the tool will pick up the change from the Habitica API and always show the current members.<br />
                </p>
                <p>
                  <b>Recommendation:</b> Use the link above if you want to provide it to your party, e.g. in the party sidebar!
                </p>
              </div>
              <div class="ui message">
                <div class="header"><i class="address card outline icon" />Contact</div>
                <p>
                  If you have questions or improvement suggestions for this tool, please open an issue in the <a href="https://github.com/habitica-tools/party-progress-info/issues">GitHub repository</a>.<br />
                  Alternatively, you can contact me <i>(@Turac)</i> on Habitica using my User ID <a href="https://habitica.com/profile/b477462a-5bb5-4040-9505-f0b049b4f0bb">b477462a-5bb5-4040-9505-f0b049b4f0bb</a>.</p>
                <p>This tool was originally created by <i>@PRoeleert</i> in 2017 and in 2021 he gave it to <i>@EstGoddess</i> to maintain. Since 2025, the tool is in my hands.</p>
                <p>Feel free, to show your appreciation towards the original creator and the previous maintainer:</p>
                <div class="kofi-container">
                  <b>@EstGoddess</b>
                  <a href="https://ko-fi.com/J3J66K0NE" target="_blank" rel="noreferrer">
                    <img class="kofi-button" src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3" border="0" alt="Buy Me a Coffee at ko-fi.com" />
                  </a>
                  <b>@PRoeleert</b>
                  <a href="https://ko-fi.com/J3J0AMLQ" target="_blank" rel="noreferrer">
                    <img class="kofi-button" src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3" border="0" alt="Buy Me a Coffee at ko-fi.com" />
                  </a>
                </div>
              </div>
              <div class="ui message">
                <div class="header"><i class="settings icon" />Maintenance</div>
                <p>
                  To reduce the load on Habitica servers, the tool caches all requests locally on your computer.<br />
                  If you run into issues with information not being up-to-date or the tool not working correctly, clearing the cache might help: <a href="#" onClick={this.clearCache}>Clear cache</a>
                </p>
              </div>
            </div>
          }
          {store.currentPage !== 'about' && !store.api.hasValidCredentials &&
            <div class="ui fluid action input">
              <AuthenticationModal store={store} parent={this} />
            </div>
          }
          {store.currentPage !== 'about' &&
            <div class="ui fluid container">
              <div class="ui info ignored message">
                <i class="help circle icon" />Go to the <a href="#" onClick={this.setPageAbout}>Help & About</a> section for more information about this tool
              </div>
              <UserList store={store} />
            </div>
          }
          {store.currentPage === 'questPets' &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Wanted Quest Pets</h4>
              </div>
              <PetProgressBar store={store} category="quest" />
              <CombinedPetList store={store} category="quest" filterable={false} />
              <div class="ui basic segment" />
              <PetLeaderboard store={store} category="quest" />
              <div class="ui horizontal divider header">
                <h4>Pet Quests available in the Party</h4>
              </div>
              <QuestList store={store} category="pet" />
              <div class="ui horizontal divider header">
                <h4>Unhatched Quest Eggs</h4>
              </div>
              <EggList store={store} category="quest" />
            </div>
          }
          {store.currentPage === 'premiumPets' &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Wanted Magic Potion Pets</h4>
              </div>
              <PetProgressBar store={store} category="premium" />
              <div class="ui horizontal divider header">
                <h5>Obtainable from Quests</h5>
              </div>
              <PremiumPetList store={store} category="premium" filterable={false} questObtainable={true} />
              <div class="ui horizontal divider header">
                <h5>Others</h5>
              </div>
              <PremiumPetList store={store} category="premium" filterable={false} questObtainable={false} />
              <div class="ui basic segment" />
              <div class="ui horizontal divider header">
                <h4>Magic Potion Pet Leaderboard</h4>
              </div>
              <PetLeaderboard store={store} category="premium" />
              <div class="ui basic segment" />
              <div class="ui horizontal divider header">
                <h4>Magic Hatching Potion Quests available in the Party</h4>
              </div>
              <QuestList store={store} category="hatchingPotion" />
              <div class="ui horizontal divider header">
                <h4>Unused Magic Hatching Potions</h4>
              </div>
              <PotionList store={store} category="premium" />
            </div>
          }
          {store.currentPage === 'dropPets' &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Wanted Standard Pets</h4>
              </div>
              <PetProgressBar store={store} category="drop" />
              <CombinedPetList store={store} category="drop" filterable={false} />
              <div class="ui basic segment" />
              <PetLeaderboard store={store} category="drop" />
              <div class="ui horizontal divider header">
                <h4>Unhatched Standard Pet Eggs</h4>
              </div>
              <EggList store={store} category="drop" />
              <div class="ui horizontal divider header">
                <h4>Unused Base Hatching Potions</h4>
              </div>
              <PotionList store={store} category="drop" />
            </div>
          }
          {store.currentPage === 'gear' &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Equipment in the Party</h4>
              </div>
              <GearLeaderboard store={store} />
              <GearList store={store} />
            </div>
          }
          {store.currentPage === 'otherQuests' &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Other Quests available in the Party</h4>
              </div>
              <div class="ui two column stackable grid">
                <div class="ui column">
                  <QuestList store={store} category="unlockable" sortable={false} showHeader={true} />
                </div>
                <div class="ui column">
                  <QuestList store={store} category="gold" sortable={false} showHeader={true} />
                </div>
              </div>
            </div>
          }
          {store.currentPage === 'backgrounds' &&
            <div class="ui fluid container">
              <div class="ui basic segment" />
              <div class="ui horizontal divider header">
                <h4>Background Collection</h4>
              </div>
              <div class="ui negative message">
                <i class="warning sign icon" />
                <p>Unfortunately the Backgrounds a player owns is not public information.</p>
                <p>When this changes in the future (hopefully), I'll offcourse show this data as well.</p>
                <p>In the mean time you can vote on the <a href="https://trello.com/c/cMeJ3uKO/408-profile-v2-change-profile-sub-tab-to-public-profile-and-show-everything-public">feature request</a></p>
              </div>
              <BackgroundList store={store} />
            </div>
          }
        </div>
        <div class="ui inverted vertical footer segment">
          <div class="ui center aligned container">
            <div class="ui stackable inverted divided grid">
              <div class="three wide column">
                <h4 class="ui inverted header">Code</h4>
                <div class="ui inverted link list">
                  <a class="item" href="https://github.com/habitica-tools/party-progress-info"><i class="github square icon" />GitHub Repository</a>
                </div>
              </div>
              <div class="three wide column">
                <h4 class="ui inverted header">Copyright</h4>
                <p class="item">Most assets are linked from <a href="https://habitica.com">Habitica</a> which are licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC-BY-NC-SA 3.0</a></p>
              </div>
              <div class="three wide column">
                <h4 class="ui inverted header">Other Info</h4>
                <div class="ui inverted link list">
                  <a class="item" href="https://habitica.wikia.com/wiki/Party_Progress_Info">Wiki</a>
                </div>
              </div>
              <div class="three wide column">
                <h4 class="ui inverted header">Related Links</h4>
                <div class="ui inverted link list">
                  <a class="item" href="https://habitica.com">Habitica</a>
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
}

export default App;
