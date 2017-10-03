import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action  } from 'mobx';
import PetInfo from './PetInfo';

@observer
class PetList extends Component {
  @observable showAll = false;
  @observable petInfo = null;

  render({store}, {petInfo}){

    if(store.loadingobjects){
        return(<div class="ui active centered inline loader"></div>);
    }
    else{
        return(
        <div class="ui fluid container">             
        <div class="column stable">
            <p>Total Pets Still Needed : <div class="badge badge-pill badge-warning">{store.totalNeededPetsParty}</div></p>
            <p>Total Pets In Party : <div class="badge badge-pill badge-info">{store.totalCountPetsParty}</div></p>
            <p>Total Pets : {store.totalCountPets}</p>
            <div class="item-rows">
            <div class ="items">
            {[...store.petCategories].map(category => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-count2">
                            {[...store.pets].filter(([id,pet]) => pet.basetype === category)
                                            .reduce((prevVal,[id,pet]) => prevVal + pet.needed , 0)
                            }
                            </span>
                            <span class="badge badge-pill badge-item badge-info badge-count">
                            {[...store.pets].filter(([id,pet]) => pet.basetype === category)
                                            .reduce((prevVal,[id,pet]) => prevVal + pet.count , 0)
                            }
                            </span>                          
                            <span class={category === this.petInfo ? "selectableInventory item-content Pet Pet-" + category + "-Base " : "item-content Pet Pet-" + category + "-Base "} onClick={this.showPetInfo.bind(this, category)}>

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
  
};

export default PetList;  