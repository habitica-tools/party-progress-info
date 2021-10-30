import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action, computed  } from 'mobx';
import PremiumPetInfo from './PremiumPetInfo';

@observer
class PremiumPetList extends Component { 
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable showAll = false;
  @observable petInfo = null;
  @observable sortKey = "1";
  @observable showleaderboard = "top3";

  @computed get petCategoriesWithCounts() {
    const fromQuest = this.props.store.quests.entries().filter(([id,quest]) => 
    quest.data.category === "hatchingPotion" || 
    quest.data.category === "timeTravelers" && quest.data.drop.items[0].type === "hatchingPotions"
        ).map(x => x[1].data.drop.items[0].key);

    let pets = [...this.props.store.premiumhatchingpotionCategories].map(function(category){
        let petdetail = {id:category};
        let categorypets = [...this.props.store.premiumpets].filter(([id,pet]) => pet.potiontype === category);
        petdetail.needed = categorypets.reduce((prevVal,[id,pet]) => prevVal + pet.needed , 0);
        petdetail.count = categorypets.reduce((prevVal,[id,pet]) => prevVal + pet.count , 0);
        petdetail.selectedcount = categorypets.reduce((prevVal,[id,pet]) => prevVal + pet.selectedcount , 0);
        petdetail.quest = fromQuest.includes(category);
        return petdetail;
    },this);

    switch(this.sortKey){
        case "1":
        pets.sort(function(a,b){
            if(a.count < b.count){
                return -1;
            }
            if(a.count > b.count) {
                return 1;
            }
            return 0;
        })        
        break;
        case "2":
        pets.sort(function(a,b){
            if(a.count > b.count){
                return -1;
            }
            if(a.count < b.count) {
                return 1;
            }
            return 0;
        })        
        break;
        case "3":
        pets.sort(function(a,b){
            if(a.id < b.id){
                return -1;
            }
            if(a.id > b.id) {
                return 1;
            }
            return 0;
        })        
        break;
        default:
        break;
    }
   
    return pets;
  }


  render({store}, {petInfo}){


    if(store.loadingobjects){
        return(<div class="ui active centered inline loader"></div>);
    }
    else{
        let totalpercentage = store.totalCountPremiumPetsParty > 0 ? parseFloat(store.totalCountPremiumPetsParty / (store.totalCountPremiumPets / 100)).toFixed(2) : "0"

        return(
        <div>
        <div class="ui stackable grid">
            <div class="twelve wide column">
                <div class="progress-container-big">
                    <div class="progress">
                        <div class="progress-bar bg-experience" style={"transition-duration: 300ms; width:" + totalpercentage + "%;"}></div>
                    </div>
                </div>
            </div>
            <div class="four wide column">
                <span class="dropdown-label">Sort By: </span>
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortPets}>
                    <option value="">Default</option>
                    <option value="1">Shortage</option>
                    <option value="2">Most</option>
                    <option value="3">A-Z</option>
              </select>        
            </div>
        </div>
        <div class="ui four statistics">
        <div class="ui tiny statistic">
            <div class="value got">
                {totalpercentage + " %"}
                </div>
                <div class="label">
                    Pets Collected %
                </div>
            </div>     
            <div class="ui tiny statistic">
                <div class="value got">
                    {store.totalCountPremiumPetsParty}
                </div>
                <div class="label">
                    Pets in Party
                </div>
            </div>                
            <div class="ui tiny statistic">
                <div class="value wanted">
                    {store.totalNeededPremiumPetsParty}
                </div>
                <div class="label">
                    Pets Wanted
                </div>
            </div>
            <div class="ui tiny statistic">
                <div class="value">
                    {store.totalCountPremiumPets}
                </div>
                <div class="label">
                    Total Pets
                </div>
            </div>                     
        </div>
        <div class="ui horizontal divider header">
            <h5>Obtainable from Quests</h5>
        </div>
        <div class="item-rows">
            <div class ="items">
            {[...this.petCategoriesWithCounts.filter(p => p.quest)].map(category => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-count2">
                            {category.needed}
                            </span>
                            <span class="badge badge-pill badge-item badge-count">
                            {category.count}
                            </span>
                            {category.selectedcount >= 1 ?
                            <span class="badge badge-pill badge-item badge-blue">
                                {category.selectedcount}
                            </span> : '' }                         
                            <span class={category.id === this.petInfo ? "selectableInventory item-content Pet Pet-" + category.id + "-Base " : "item-content Pet Pet-" + category.id + "-Base "} onClick={this.showPetInfo.bind(this, category.id)}>
                                <img src={this.imageurl + "Pet-Wolf-" + category.id + ".png"} alt={category.id}  />
                            </span>
                        </div>                      
                        <span class="pettxt">{category.id}</span>
                    </div>
                    </div>
            )}
            </div>
        </div>
        <div class="ui horizontal divider header">
            <h5>Others</h5>
        </div>
        <div class="item-rows">
            <div class ="items">
            {[...this.petCategoriesWithCounts.filter(p => !p.quest)].map(category => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-count2">
                            {category.needed}
                            </span>
                            <span class="badge badge-pill badge-item badge-count">
                            {category.count}
                            </span>
                            {category.selectedcount >= 1 ?
                            <span class="badge badge-pill badge-item badge-blue">
                                {category.selectedcount}
                            </span> : '' }                         
                            <span class={category.id === this.petInfo ? "selectableInventory item-content Pet Pet-" + category.id + "-Base " : "item-content Pet Pet-" + category.id + "-Base "} onClick={this.showPetInfo.bind(this, category.id)}>
                                <img src={this.imageurl + "Pet-Wolf-" + category.id + ".png"} alt={category.id}  />
                            </span>
                        </div>                      
                        <span class="pettxt">{category.id}</span>
                    </div>
                    </div>
            )}
            </div>
        </div>
        <div class="column">
            {this.petInfo === null ? <br/> :
                <PremiumPetInfo category={this.petInfo} store={store} />
            }
        </div>
        <div class="column">
            <div class="ui horizontal divider header">
                <h4>Magic Potion Pet Leaderboard</h4>
            </div>
            <table class="ui celled table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Pet Count</th>
                    <th>Percentage of Total</th>
                </tr>
            </thead>
            <tbody>        
            {this.showleaderboard === 'top3' &&       
            store.top3premiumpetleaderboard.map((user,index) => 
                
                    user.data.profile !== undefined ?
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.data.profile.name}</td>
                            <td>{user.totalPremiumPetCount}</td>
                            <td>{store.totalCountPremiumPetsParty > 0 ? parseFloat(user.totalPremiumPetCount / (store.totalCountPremiumPets / 100)).toFixed(2) + "%" : "0%"}</td>
                        </tr>
                        :
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.id}</td>
                            <td>{user.totalPremiumPetCount}</td>
                            <td>{store.totalCountPremiumPetsParty > 0 ? parseFloat(user.totalPremiumPetCount / (store.totalCountPremiumPets / 100)).toFixed(2) + "%" : "0%"}</td>
                        </tr>
            )
            }
            {this.showleaderboard === 'all' &&       
            store.premiumpetleaderboard.map((user,index) => 
                
                    user.data.profile !== undefined ?
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.data.profile.name}</td>
                            <td>{user.totalPremiumPetCount}</td>
                            <td>{store.totalCountPremiumPetsParty > 0 ? parseFloat(user.totalPremiumPetCount / (store.totalCountPremiumPets / 100)).toFixed(2) + "%" : "0%"}</td>
                        </tr>
                        :
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.id}</td>
                            <td>{user.totalPremiumPetCount}</td>
                            <td>{store.totalCountPremiumPetsParty > 0 ? parseFloat(user.totalPremiumPetCount / (store.totalCountPremiumPets / 100)).toFixed(2) + "%" : "0%"}</td>
                        </tr>
            )
            }
            </tbody>
            </table>
            {this.showleaderboard === 'top3' &&   
                <button class="ui blue button" onClick={this.handleLeaderboardShowAll}><i class="unhide icon"></i>Show All</button>
            }            
            {this.showleaderboard === 'all' &&   
                <button class="ui olive button" onClick={this.handleLeaderboardTop3Only}><i class="hide icon"></i>Top 3 Only</button>
            }              
        </div>
        </div>
        );
        }
    }

    @action setPetInfo(category){
        if(this.petInfo === category){
            this.petInfo = null;
        }
        else{
            this.petInfo = category;         
        }
    }
    
    showPetInfo = (e) => {
        this.setPetInfo(e);
    }
    
    @action sortPets = (e) => {
        this.sortKey = e.target.value;
    }

    @action handleLeaderboardShowAll = (e) => {
        this.showleaderboard = "all";
    }

    @action handleLeaderboardTop3Only = (e) => {
        this.showleaderboard = "top3";
    }

};

export default PremiumPetList;  