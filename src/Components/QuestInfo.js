import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Quest extends Component {
    //TODO Better userrenderer errorprone
    render({quest, store, questlist}) {
        return (
            <div class="ui mini modal active">
            <div class="header">{quest.data.text}
            <button class="ui icon right floated button" onClick={this.Close}>
                <i class="close icon"></i>
            </button>
            </div>
            <div class="content">
                    {quest.users.sort(function(a,b){
                        if(a.data.items.quests[quest.id] > b.data.items.quests[quest.id]){
                            return -1;
                        }
                        if(a.data.items.quests[quest.id] < b.data.items.quests[quest.id]){
                            return 1;
                        }
                        return 0;
                    }).map(quser =>
                    <div key={quser.id}>
                        {quser.data.profile.name + " has " + quser.data.items.quests[quest.id]}
                    </div>
                    )}
            </div>
        </div>
        );
    }

    Close = (e) => {
        this.props.questlist.hideInfo();
    }
}


export default Quest;