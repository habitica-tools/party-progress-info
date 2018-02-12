import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class EggInfo extends Component {
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
                        <th>Egg</th>
                        <th>User(s) Has</th>
                    </tr>
                </thead>
                <tbody>
                    {[...store.eggs].filter(([id,egg]) => egg.id === category)
                                    .map(([id,egg]) =>
                    <tr>
                        <td>{category}</td>
                        <td>{egg.users.map(user => user.data.profile.name).join(', ')}</td>
                    </tr>   
                    )}
                </tbody>
            </table>
        </div>
        );

    }
}


export default EggInfo;