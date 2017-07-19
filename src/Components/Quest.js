import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class Quest extends Component {

    render({quest, id}) {
        return (
        <button class={"inventory_quest_scroll_" + id} id={id} onClick={this.showQuestInfo} >
          <div class="badge badge-info stack-count">
            {quest.count}
          </div>
        </button>
        );
    }
    
    showQuestInfo = (e) => {
        this.props.questlist.showInfo(this.props.quest);
    }
    
    
}


export default Quest;