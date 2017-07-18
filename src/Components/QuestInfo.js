import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
require('preact/devtools');

@observer
class Quest extends Component {

    render({quest, id, store}) {
        return (
        <div>
            <div class={"inventory_quest_scroll_" + id}>
                <div class="badge badge-info stack-count">
                    {quest.count}
                </div>
            </div>
            <div>
                {quest.data.text}
            </div>
            <div>
                <ul>
                    {quest.users.map(quser => <li>{store.users.filter(user => user.id === quser.userid)[0].data.profile.name} - {quser.number}</li>)}
                </ul>
            </div>
        </div>
        );
    }
}


export default Quest;