import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable } from 'mobx';
import Pet from './Pet';

@observer
class PetList extends Component {
  @observable showAll = false;
  @observable petInfo = null;

  render({store}){

    if(store.loadingobjects){
        return(<div class="ui active centered inline loader"></div>);
    }
    else{
        return( 
        <div class="column">
            <p>Total Pets Still Needed : {store.totalNeededPetsParty}</p>
            <div class="ui horizontal list">
            {[...store.petCategories].map(category => 
                    <div class="item">
                        <div class={"pet-evolved Pet-" + category + "-Base"}>

                        </div>
                        <div class="badge badge-info stack-count">
                        {[...store.pets].filter(([id,pet]) => pet.basetype === category)
                                        .reduce((prevVal,[id,pet]) => prevVal + pet.needed , 0)
                        }
                        </div>
                    </div>
            )}
            </div>
        </div>
        );
    }
  }
  
};

export default PetList;  