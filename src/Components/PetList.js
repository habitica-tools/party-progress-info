import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action } from 'mobx';
import Pet from './Pet';

@observer
class PetList extends Component {
  @observable showAll = false;
  @observable petInfo = null;

  isFunction = function(o) { return toString.call(o) == '[object Function]'; };
  group = function(list,prop){
      return list.reduce(function(grouped,item){
        var key = isFunction(prop) ? prop.apply(this, [item]) : item[prop];
        grouped[key] = grouped[key] || [];
        grouped[key].push(item);
        return grouped;
      },{});
  }

  render({store}){

    if(store.loadingobjects){
        return(<div class="ui active centered inline loader"></div>);
    }
    else{
        var pets = store.pets.entries().map(([id,pet]) =>
            pet
        );
        var totalneed = pets.reduce((prevVal, pet) =>  prevVal + pet.needed , 0);
        var categories = new Set();
        for(var pet of pets){
            categories.add(pet.basetype);
        }
        var grouped = 
            [...categories].map(category => 
                {category: pets.filter(pet => pet.basetype === category)
                                .reduce((prevVal,pet) => prevVal + pet.needed,0)
                });
        return( 
        <div class="column">
            <p>Total Pets Still Needed : {totalneed}</p>
            <div class="ui list">               
                {store.pets.entries().map(([id,pet]) =>
                    <Pet pet={pet} id={id} />
                )}
            </div>
        </div>
        );
    }

  
  }

  
};

export default PetList;  