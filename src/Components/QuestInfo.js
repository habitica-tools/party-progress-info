import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
require('preact/devtools');

@observer
class Quest extends Component {
    //TODO Better userrenderer errorprone
    render({quest, store}) {
        return (
        <div class="ui fluid container">
            <br/>
            <div class="ui horizontal divider header">
              <h4>{quest.data.text}</h4>
            </div>
            <div>
                {quest.data.notes}
            </div>
            <table class="ui very basic collapsing celled table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Nr of Quests</th>
                    </tr>
                </thead>
                <tbody>
                    {quest.users.map(quser => 
                    <tr>
                        <td>{quser.data.profile.name}</td>
                        <td>{quser.data.items.quests[quest.id]}</td>
                    </tr>
                    
                    )}
                    
                </tbody>
            </table>
        </div>
        );
    }
}


export default Quest;