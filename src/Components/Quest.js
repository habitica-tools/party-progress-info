import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Quest extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

  render() {
    const quest = this.props.quest;
    const id = this.props.id;

    return (
      <div class="item-wrapper">
        <div class="item" data-tooltip={quest.data.text}>
          <span class="badge badge-pill badge-item badge-count">
            {quest.count}
          </span>
          {quest.selectedcount >= 1 ?
            <span class="badge badge-pill badge-item badge-blue">
              {quest.selectedcount}
            </span>
            : ''
          }
          <span class={"item-content Quest inventory_quest_scroll_" + id} id={id} onClick={this.showQuestInfo} >
            <img src={this.imageurl + "inventory_quest_scroll_" + id + ".png"} alt={id} />
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