import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action, computed  } from 'mobx';
import PetInfo from './PetInfo';

@observer
class PetList extends Component {
  @observable showAll = false;
  @observable petInfo = null;
  @observable sortKey = "";
  @computed get petCategoriesWithCounts() {
    let pets = [...this.props.store.petCategories].map(function(category){
        let petdetail = {id:category};
        petdetail.needed = [...this.props.store.pets].filter(([id,pet]) => pet.basetype === category).reduce((prevVal,[id,pet]) => prevVal + pet.needed , 0);
        petdetail.count = [...this.props.store.pets].filter(([id,pet]) => pet.basetype === category).reduce((prevVal,[id,pet]) => prevVal + pet.count , 0);
        return petdetail;
    },this);

    if(this.sortKey === "1"){
        pets.sort(function(a,b){
            if(a.count < b.count){
                return -1;
            }
            if(a.count > b.count) {
                return 1;
            }
            return 0;
        })
    }
    else{

    }    
    return pets;
  }


  render({store}, {petInfo}){


    if(store.loadingobjects){
        return(<div class="ui active centered inline loader"></div>);
    }
    else{

        //this.sortedpetCategories = [...store.petCategories].map(category => createmorepetdetail(category));

        return(
        <div class="ui fluid container">             
        <div class="column stable">
        <div class="float-right">
                <span class="dropdown-label">Sort By</span>
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortPets}>
                    <option value="">Default</option>
                    <option value="1">Shortage</option>
              </select>        
            </div>          
            <p>Total Pets Still Needed : <div class="badge badge-pill badge-warning">{store.totalNeededPetsParty}</div></p>
            <p>Total Pets In Party : <div class="badge badge-pill badge-info">{store.totalCountPetsParty}</div></p>
            <p>Total Pets : {store.totalCountPets}</p>
              
            <div class="item-rows">
            <div class ="items">
            {[...this.petCategoriesWithCounts].map(category => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-count2">
                            {category.needed}
                            </span>
                            <span class="badge badge-pill badge-item badge-info badge-count">
                            {category.count}
                            </span>                          
                            <span class={category.id === this.petInfo ? "selectableInventory item-content Pet Pet-" + category.id + "-Base " : "item-content Pet Pet-" + category.id + "-Base "} onClick={this.showPetInfo.bind(this, category.id)}>

                            </span>
                        </div>                      
                    </div>
                    </div>
            )}
            </div>
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

                        /*
                        Not possible since keys between pet and quest don't always match unfortunatley
                        <div>
                            {[...store.quests].filter(([id,quest]) => id === category.toLowerCase()).reduce((prevVal,[id,quest]) => prevVal + 1, 0)}
                        </div> 
                        */

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