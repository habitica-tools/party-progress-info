import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class Pet extends Component {

    render({pet, id}) {
        return (
            <div>
                {id} - {pet.basetype} #{pet.count}
            </div>
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