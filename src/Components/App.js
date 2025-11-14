import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';
import Settings from './Settings';
import QuestList from './QuestList';
import HatchingPotionQuestList from './HatchingPotionQuestList';
import QuestEggsList from './QuestEggsList';
import BaseEggsList from './BaseEggsList';
import PetList from './PetList';
import BasePetList from './BasePetList';
import PremiumPetList from './PremiumPetList';
import PremiumHatchingPotionList from './PremiumHatchingPotionList';
import GearList from './GearList';
import BackgroundList from './BackgroundList';
import AuthenticationModal from './AuthenticationModal';

@observer
class App extends Component {
  askingAuth = false;

  openAuthenticationModal = () => {
    this.askingAuth = true;
  }

  hideAuthenticationModal() {
    this.askingAuth = false;
  }

  gotoPetsQuestEggs = () => {
    this.props.store.gotoPetsQuestEggs();
  }
  gotoBasePets = () => {
    this.props.store.gotoBasePets();
  }

  gotoPremiumPets = () => {
    this.props.store.gotoPremiumPets();
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

  render() {
    const store = this.props.store;
    return (
      <div>
        <div class="ui stackable inverted pointing menu">
          <a href="#" class="item header" onClick={this.gotoPetsQuestEggs}>
            Habitica Party Progress Info
          </a>
          <a class={store.menupage === "petsquesteggs" ? "item active" : "item"} onClick={this.gotoPetsQuestEggs}>
            Quest Pets
          </a>
          <a class={store.menupage === "premiumpets" ? "item active" : "item"} onClick={this.gotoPremiumPets}>
            Magic Potion Pets
          </a>
          <a class={store.menupage === "basepets" ? "item active" : "item"} onClick={this.gotoBasePets}>
            Standard Pets
          </a>
          <a class={store.menupage === "gear" ? "item active" : "item"} onClick={this.gotoGear}>
            Equipment
          </a>
          <a class={store.menupage === "otherquests" ? "item active" : "item"} onClick={this.gotoOtherQuests}>
            Other Quests
          </a>
          <a class={store.menupage === "backgrounds" ? "item active" : "item"} onClick={this.gotoBackgrounds}>
            Backgrounds
          </a>
          <a class={store.menupage === "about" ? "item active" : "item"} onClick={this.gotoAbout}>
            Help &amp; About
          </a>
        </div>
        <div class="ui main container">
          {store.menupage === "about" &&
            <div class="ui fluid container">
              <div class="ui info message">

                <div class="header"><i class="help circle icon"></i>Help</div>
                <p>With this tool you can see the number of pets still needed for a party/user and which quests are in the inventory. This tool will also give you an overview of equipment and backgrounds.</p>
                <p></p>

                <h3>Adding users one by one</h3>
                <p>To get started fill in your own + your party members' Habitica User ID's on the form on the other pages</p>
                <p>
                  <ol>
                    <li>Get your User ID <a href="https://habitica.com/user/settings/api">here</a></li>
                    <li>Then get your party members' User ID-s by opening their profile - the User ID is in the url after <code>/profile/</code></li>
                    <li>Fill in each User ID + Click Add</li>
                    <li>Save your unique link by bookmarking it so you can revisit the page every time</li>
                    <li>Put your unique link in your party sidebar on Habitica</li>
                    <li>Share the love!</li>
                  </ol>
                </p>
                <h3>Adding your whole party in one go</h3>
                <p>If you want to add your party but don't want to do the heavy lifting (of getting all User ID-s and entering them separately), there are <b>two ways</b> to add your whole party (including yourself). </p>
                <h4>1. Using the 'Add Party' button next to the 'Add' button.</h4>
                <p>This requires you to insert your UserId and API Token to authenticate yourself. Both can be found <a href="https://habitica.com/user/settings/api">here</a></p>
                <p><i>Note: The app will not store your API Token in any way, it is only used for the request to Habitica API to retrieve your party members' ID-s.</i></p>
                <h4>2. Using a bookmarked script</h4>
                <p>Another way is to bookmark this link:</p>
                <p><h4><a href='javascript:(function(){loadjs=function(){var e=function(){},t={},n={},i={};function a(e,t){if(e){var a=i[e];if(n[e]=t,a)for(;a.length;)a[0](e,t),a.splice(0,1)}}function o(t,n){t.call&&(t={success:t}),n.length?(t.error||e)(n):(t.success||e)(t)}function s(t,n,i,a){var o,r,c=document,u=i.async,f=(i.numRetries||0)+1,h=i.before||e;a=a||0,/(^css!|\.css$)/.test(t)?(o=!0,(r=c.createElement("link")).rel="stylesheet",r.href=t.replace(/^css!/,"")):((r=c.createElement("script")).src=t,r.async=void 0===u||u),r.onload=r.onerror=r.onbeforeload=function(e){var c=e.type[0];if(o&&"hideFocus"in r)try{r.sheet.cssText.length||(c="e")}catch(e){c="e"}if("e"==c&&(a+=1)<f)return s(t,n,i,a);n(t,c,e.defaultPrevented)},!1!==h(t,r)&&c.head.appendChild(r)}function r(e,n,i){var r,c;if(n&&n.trim&&(r=n),c=(r?i:n)||{},r){if(r in t)throw"LoadJS";t[r]=!0}!function(e,t,n){var i,u,f=(e=e.push?e:[e]).length,h=f,l=[];for(i=function(e,t,n){if("e"==t&&l.push(e),"b"==t){if(!n)return;l.push(e)}var i;--f||(o(c,i=l),a(r,i))},u=0;u<h;u++)s(e[u],i,n)}(e,0,c)}return r.ready=function(e,t){return function(e,a){var s,r,c,u=[],f=(e=e.push?e:[e]).length,h=f;for(s=function(e,n){n.length&&u.push(e),--h||o(t,u)};f--;)r=e[f],(c=n[r])?s(r,c):(i[r]=i[r]||[]).push(s)}(e),r},r.done=function(e){a(e,[])},r.reset=function(){t={},n={},i={}},r.isDefined=function(e){return e in t},r}(),loadjs("https://unpkg.com/axios/dist/axios.min.js",function(){var e=localStorage.getItem("habit-mobile-settings"),t="https://habiticapartytools.surge.sh/?users=";e?(e=JSON.parse(e)).auth&&e.auth.apiId&&e.auth.apiToken&&(axios.defaults.headers.common["x-api-user"]=e.auth.apiId,axios.defaults.headers.common["x-api-key"]=e.auth.apiToken,axios.get("https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true", {headers: {"x-client": "d3c5312b-0e53-4cbc-b836-4c2a63e0ff06-HabiticaPartyProgressInfo"}}).then(function(e){e.data.data.map(function(e,n){t+=e._id+"|"}),document.location.href=t}).catch(function(e){console.log(e)})):alert("Run this on Habitica.com")});})()'>THE LINK TO BOOKMARK</a></h4></p>
                <p>and when you are on the main <a href="https://habitica.com">habitica.com</a> website and you are logged-in open the new bookmark in your browser.</p>
                <p>This will automatically read your party members and transfer you back to this tool, (it could take a couple of seconds).</p>
              </div>
              <div class="ui message">
                <div class="header"><i class="address card outline icon"></i>Contact</div>
                <p>If you have suggestions for improvement for this tool you can always contact me on Habitica, my UserID = d3c5312b-0e53-4cbc-b836-4c2a63e0ff06 with handle @EstGoddess.</p>
                <p>Log a Ticket on <a href="https://bitbucket.org/DAlgma/habitica-tools">Bitbucket</a></p>
                <p>Or you can just say hi to me if you like this tool as well :)</p>
                <p>This tool was originally created by PRoeleert in 2017 and in 2021 he gave it to me to maintain.</p>
                <p>If you want to support <b>me</b>, then feel free to</p>
                <p><a href='https://ko-fi.com/J3J66K0NE' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a></p>
                <p>If you want to support <b>the original creator</b> of this page, PRoeleert, then:</p>
                <p><a href='https://ko-fi.com/J3J0AMLQ' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi5.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a></p>
              </div>
              <div class="ui message">
                <div class="header"><i class="address card outline icon"></i>Privacy Policy</div>
                <p>I provide this application, for free of use. I am not in the business of selling your personal information to access this app.</p>
                <p>I may use the following third party services with anonymised data to analyse our usage and performance</p>
                <p>Third Party Services:
                  <ul>
                    <li><a href="https://privacy.google.com/businesses/compliance">Google Analytics</a></li>
                    <li><a href="https://surge.sh/tour">Surge.sh</a></li>
                  </ul>
                </p>
              </div>
            </div>
          }
          {(store.authUserId == null || store.authKey == null) &&
            <AuthenticationModal store={store} parent={this} />
          }
          {store.menupage !== "about" &&
            <div class="ui fluid container">
              <div class="ui info ignored message">
                <i class="help circle icon"></i>Goto the <a href="#" onClick={this.gotoAbout}>Help About Section</a> for info on how to use this Tool.
              </div>
              <Settings store={store} />
            </div>
          }
          {store.menupage === "petsquesteggs" &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Wanted Quest Pets</h4>
              </div>
              <PetList store={store} />
              <div class="ui basic segment"></div>
              <div class="ui horizontal divider header">
                <h4>Pet Quests Available in the Party</h4>
              </div>
              <QuestList store={store} category="pet" />
              <div class="ui horizontal divider header">
                <h4>Non Hatched Quest Eggs</h4>
              </div>
              <div class="ui basic segment"></div>
              <QuestEggsList store={store} />
            </div>
          }
          {store.menupage === "premiumpets" &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Wanted Magic Potion Pets</h4>
              </div>
              <PremiumPetList store={store} />
              <div class="ui basic segment"></div>
              <div class="ui horizontal divider header">
                <h4>Magic Hatching Potion Quests Available in the Party</h4>
              </div>
              <HatchingPotionQuestList store={store} category="hatchingPotion" />
              <div class="ui basic segment"></div>
              <div class="ui horizontal divider header">
                <h4>Non Used Magic Hatching Potions</h4>
              </div>
              <div class="ui basic segment"></div>
              <PremiumHatchingPotionList store={store} />
            </div>
          }
          {store.menupage === "basepets" &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Wanted Standard Pets</h4>
              </div>
              <BasePetList store={store} />
              <div class="ui basic segment"></div>
              <div class="ui horizontal divider header">
                <h4>Non Hatched Standard Pet Eggs</h4>
              </div>
              <div class="ui basic segment"></div>
              <BaseEggsList store={store} />
            </div>
          }
          {store.menupage === "gear" &&
            <div class="ui fluid container">
              <GearList store={store} />
            </div>
          }
          {store.menupage === "otherquests" &&
            <div class="ui fluid container">
              <div class="ui horizontal divider header">
                <h4>Other Quests Available in Party</h4>
              </div>
              <div class="ui basic segment"></div>
              <div class="ui two column stackable grid">
                <QuestList store={store} category="unlockable" />
                <QuestList store={store} category="gold" />
              </div>
            </div>
          }
          {store.menupage === "backgrounds" &&
            <div class="ui fluid container">
              <div class="ui basic segment"></div>
              <div class="ui horizontal divider header">
                <h4>Background Collection</h4>
              </div>
              <div class="ui negative message">
                <i class="warning sign icon"></i>
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
                  <a class="item" href="https://bitbucket.org/pietervanh/habitica-tools"><i class="bitbucket square icon"></i>Git Repository</a>
                </div>
              </div>
              <div class="three wide column">
                <h4 class="ui inverted header">Copyright</h4>
                <p class="item">Some Assets are linked from <a href="https://habitica.com">HabitRPG</a> which are licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC-BY-NC-SA 3.0</a></p>
              </div>
              <div class="three wide column">
                <h4 class="ui inverted header">Other Info</h4>
                <div class="ui inverted link list">
                  <a class="item" href="http://habitica.wikia.com/wiki/Party_Progress_Info">Wiki</a>
                </div>
              </div>
              <div class="three wide column">
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