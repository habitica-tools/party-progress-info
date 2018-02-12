import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action, computed  } from 'mobx';
import PetInfo from './PetInfo';

@observer
class PetList extends Component { 
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable showAll = false;
  @observable petInfo = null;
  @observable sortKey = "1";
  @computed get petCategoriesWithCounts() {
    let pets = [...this.props.store.petCategories].map(function(category){
        let petdetail = {id:category};
        petdetail.needed = [...this.props.store.pets].filter(([id,pet]) => pet.basetype === category).reduce((prevVal,[id,pet]) => prevVal + pet.needed , 0);
        petdetail.count = [...this.props.store.pets].filter(([id,pet]) => pet.basetype === category).reduce((prevVal,[id,pet]) => prevVal + pet.count , 0);
        petdetail.usercount = 0;
        if(this.props.store.infoUser !== "" && this.props.store.infoUser.data.items.pets !== undefined){
            //convert pets to array value = -1=nopet, 5->40 in progress or 5 + mount = mount and pet
            let userpets = Object.keys(this.props.store.infoUser.data.items.pets).map(k => ({pet:k, value: this.props.store.infoUser.data.items.pets[k]}))
            //filter non quest pets
            userpets = userpets.filter(up => [...this.props.store.pets].map(([key,data]) => key).includes(up.pet));
            //convert mounts to array value = boolean
            let usermounts = [];
            if(this.props.store.infoUser.data.items.mounts !== undefined){
                usermounts = Object.keys(this.props.store.infoUser.data.items.mounts).map(k => ({pet:k, value: this.props.store.infoUser.data.items.mounts[k]}))
            }
            userpets = userpets.map(function(pt){
                let mountcnt = usermounts.filter(um => pt.pet === um.pet && um.value === true).length
             if(pt.value === -1 && mountcnt === 1){
                 //no pet but mount
                 return {pet:pt.pet, value:1};
             }
             else{
                 if(pt.value >= 5){
                    if(mountcnt === 1){
                        return {pet:pt.pet, value:2};
                    }
                    else{
                        return {pet:pt.pet, value:1};
                    }
                 }
                 else{
                     return {pet:pt.pet, value:0};
                 }
             }   
            });
            userpets = userpets.map(up => ({pet:up.pet.substr(0,up.pet.indexOf('-')), value: up.value}))
            petdetail.usercount = userpets.filter(up => up.pet === category).reduce((prevVal,up) => prevVal + up.value , 0)
            petdetail.quests
        }
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
        let totalpercentage = store.totalCountPetsParty > 0 ? parseInt(store.totalCountPetsParty / (store.totalCountPets / 100)) : "0"

        return(
        <div>
        <div class="ui stackable grid">
            <div class="twelve wide column">
                <div class="progress-container">
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
                <div class="value wanted">
                    {store.totalNeededPetsParty}
                </div>
                <div class="label">
                    Pets Wanted
                </div>
            </div>
            <div class="ui tiny statistic">
                <div class="value got">
                    {store.totalCountPetsParty}
                </div>
                <div class="label">
                    Pets in Party
                </div>
            </div>      
            <div class="ui tiny statistic">
                <div class="value got">
                {totalpercentage + " %"}
                </div>
                <div class="label">
                    Pets Collected %
                </div>
            </div>
            <div class="ui tiny statistic">
                <div class="value">
                    {store.totalCountPets}
                </div>
                <div class="label">
                    Total Pets
                </div>
            </div>                     
        </div>
        <div class="ui basic segment"></div>
        <div class="item-rows">
            <div class ="items">
            {[...this.petCategoriesWithCounts].map(category => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-count2">
                            {category.needed}
                            </span>
                            <span class="badge badge-pill badge-item badge-count">
                            {category.count}
                            </span>
                            {category.usercount >= 1 ?
                            <span class="badge badge-pill badge-item badge-blue">
                                {category.usercount}
                            </span> : '' }                         
                            <span class={category.id === this.petInfo ? "selectableInventory item-content Pet Pet-" + category.id + "-Base " : "item-content Pet Pet-" + category.id + "-Base "} onClick={this.showPetInfo.bind(this, category.id)}>
                                <img src={this.imageurl + "Pet-" + category.id + "-Base.png"} alt={category.id}  />
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
                <PetInfo category={this.petInfo} store={store} />
            }
        </div>
        </div>
        );
        }
    }

    @action setPetInfo(category){
        this.petInfo = category;
    }
    
    showPetInfo = (e) => {
        this.setPetInfo(e);
    }
    
    @action sortPets = (e) => {
        this.sortKey = e.target.value;
    }
  
};

export default PetList;  