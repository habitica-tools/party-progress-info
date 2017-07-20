import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class User extends Component {

    render({user}) {
        return (
            <div class="item">
                <img class="ui avatar image" src={"https://habitica.com/export/avatar-" + user.id + ".png"}/>
                <div class="middle aligned content">
                    <div class="header">{user.data.profile.name}&nbsp;&nbsp;<div class="ui button" onClick={this.removeUser}><i class="close icon"></i></div></div>
                    <div class="description"><b>{user.data.stats.class}</b> @ Lvl {user.data.stats.lvl} <i class="dollar icon"></i>{parseInt(user.data.stats.gp)}</div>
                </div>
            </div>
        );
    }

    removeUser = (e) => {
        this.props.store.removeUser(this.props.user);
    }

}


export default User;