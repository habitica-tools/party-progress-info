import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class User extends Component {

    render({user}) {
        return (
            <div class="card">
                <div class="content">
                    <div class="right floated ui icon button" onClick={this.removeUser}><i class="close icon"></i></div>
                    <div class="header">{user.data.profile.name}</div>
                    <div class="meta">
                        Lvl {user.data.stats.lvl} <span class="label label-info">{user.data.stats.class}</span> 
                        <span style="color:#b58105"><i class="dollar icon"></i>{parseInt(user.data.stats.gp)}</span>
                    </div>
                </div>
            </div>
        );
    }

    removeUser = (e) => {
        this.props.store.removeUser(this.props.user);
    }

}


export default User;

//<img class=" right floated mini ui image" src={"https://habitica.com/export/avatar-" + user.id + ".png"}/>