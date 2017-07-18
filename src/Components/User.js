import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
require('preact/devtools');

@observer
class User extends Component {

    render({user}) {
        return (
            <li>
                <button onClick={this.removeUser}>
                <div class>
                    {user.data.profile.name} : {user.data.stats.class} @ {user.data.stats.lvl}
                </div>
                </button>
            </li>
        );
    }

    removeUser = (e) => {
        this.props.store.removeUser(this.props.user);
    }

}


export default User;