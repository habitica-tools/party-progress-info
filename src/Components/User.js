import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class User extends Component {

    render({user}) {
        let mp = user.data.stats.mp / (user.data.stats.maxMP / 100) > 100 ? 100 : user.data.stats.mp / (user.data.stats.maxMP / 100);
        let hp = user.data.stats.hp / (user.data.stats.maxHealth / 100) > 100 ? 100 : user.data.stats.hp / (user.data.stats.maxHealth / 100);
        return (
            <div class={this.checkinfoUser(user) ? 'card blue': 'card'}>
                <div class="content">
                    <div class="header">{user.data.profile.name}</div>
                    <div class="meta">
                        Lvl {user.data.stats.lvl} <span class="label label-info">{user.data.stats.class}</span> 
                        <span style="color:#b58105"><i class="dollar icon"></i>{parseInt(user.data.stats.gp)}</span>
                        <span><i class="bomb icon"></i>{user.damage}</span>
                        <div class="progress-container">
                            <div class="progress">
                                <div class="progress-bar bg-health" style={"transition-duration: 300ms; width:" + hp + "%;"}></div>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-mana" style={"transition-duration: 300ms; width:" + mp + "%;"}></div>
                            </div>                            
                        </div>                                                                      
                    </div>
                    <div class="extra content">
                        <span class="left floated ui blue" onClick={this.setInfoUser}><i class="info icon"></i>Select</span>
                        <span class="right floated ui red" onClick={this.removeUser}><i class="trash icon"></i>Remove</span>
                    </div>                    
                </div>
            </div>
        );
    }

    checkinfoUser(user) {
        if(this.props.user.store.infoUser !== ""){
            if(this.props.user.store.infoUser.data.profile.name === user.data.profile.name){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
        
    }

    removeUser = (e) => {
        this.props.user.store.removeUser(this.props.user);
    }

    setInfoUser = (e) => {
        this.props.user.store.setInfoUser(this.props.user);
    }

}


export default User;

//<img class=" right floated mini ui image" src={"https://habitica.com/export/avatar-" + user.id + ".png"}/>