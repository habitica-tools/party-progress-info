import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class Quest extends Component {

    render({quest, id}) {
        return (
        <div class="item-wrapper">
        <div class="item">
          <span class="badge badge-pill badge-item badge-count">
            {quest.count}
          </span>            
            <span class={"item-content inventory_quest_scroll_" + id} id={id} onClick={this.showQuestInfo} >
            </span>
        </div>
        </div>
        );
    }
    
    showQuestInfo = (e) => {
        this.props.questlist.showInfo(this.props.quest);
    }
    
    
}


export default Quest;