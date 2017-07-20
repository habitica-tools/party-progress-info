import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class Pet extends Component {

    render({pet, id}) {
        return (
            <div>
            <div class={"pet-evolved Pet-" + id}>

            </div>
            <div class="badge badge-info stack-count">
                {pet.needed}
            </div>
            </div>           
            //{id} - {pet.basetype} Needed In Party {pet.needed}
            /*
        <button class={"inventory_quest_scroll_" + id} id={id} onClick={this.showQuestInfo} >
          <div class="badge badge-info stack-count">
            {quest.count}
          </div>
        </button>
        */
        );
    }
    
    showPetInfo = (e) => {
        //this.props.questlist.showInfo(this.props.quest);
    }
    
    
}


export default Pet;