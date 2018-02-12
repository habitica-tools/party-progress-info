import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class GearInfo extends Component {
    render({category, store}) {
        return (
        <div class="ui fluid">
            <br/>
            <div class="ui horizontal divider header">
              <h4>{category}</h4>
            </div>
            <table class="ui very basic collapsing celled table">
                <thead>
                    <tr>
                        <th>Gear</th>
                        <th>User(s) Has</th>
                    </tr>
                </thead>
                <tbody>
                    {[...store.gear].filter(([id,gear]) => gear.id === category)
                                    .map(([id,gear]) =>
                    <tr>
                        <td>{gear.data.text}</td>
                        <td>{gear.users.map(user => user.data.profile.name).join(', ')}</td>
                    </tr>   
                    )}
                </tbody>
            </table>
        </div>
        );

    }
}


export default GearInfo;