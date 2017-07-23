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
        <div class="column">
            <p>Total Pets : {store.totalCountPets}</p>
            <p>Total Pets In Party : <div class="badge badge-warning stack-count">{store.totalCountPetsParty}</div>
            <p>Total Pets Still Needed : <div class="badge badge-info stack-count">{store.totalNeededPetsParty}</div></p>
            <div class="ui horizontal list">
            {[...store.petCategories].map(category => 
                    <div class="item">
                        <div class={"pet-evolved Pet-" + category + "-Base"} onClick={this.showPetInfo.bind(this, category)}>

                        </div>
                        <div class="badge badge-error stack-count">
                        {[...store.pets].filter(([id,pet]) => pet.basetype === category)
                                        .reduce((prevVal,[id,pet]) => prevVal + pet.needed , 0)
                        }
                        </div>
                        <div class="badge badge-info stack-count">
                        {[...store.pets].filter(([id,pet]) => pet.basetype === category)
                                        .reduce((prevVal,[id,pet]) => prevVal + pet.count , 0)
                        }
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
  
};

export default PetList;  