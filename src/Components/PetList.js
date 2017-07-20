import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action } from 'mobx';
import Pet from './Pet';

@observer
class PetList extends Component {
  @observable showAll = false;
  @observable petInfo = null;

  render({store}){
    return(
    store.loadingobjects ? <div class="ui active centered inline loader"></div> :
    <div class="column">
        <div class="ui list">
            {store.pets.entries().map(([id,pet]) =>
                <Pet pet={pet} id={id} />
            )}
        </div>
    </div>
    );
  }

  
};

export default PetList;  