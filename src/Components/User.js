import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class User extends Component {
  render() {
    const { user } = this.props;

    if (user.loading) {
      return (
        <div class="card">
          <div class="content">
            <div class="ui active centered loader"></div>
          </div>
        </div>
      );
    }

    if (user.invalid) {
      return (
        <div class="card">
          <div class="content">
            <div class="center aligned header">
              <i class="user times icon"></i>
            </div>
            <div class="description">
              {user.data.customMessage}
            </div>
          </div>
          <div class="extra content">
            <a class="right floated" onClick={this.removeUser}><i class="trash icon"></i>Remove</a>
          </div>
        </div>
      );
    }

    const mp = user.data.stats.mp / (user.data.stats.maxMP / 100) > 100 ? 100 : user.data.stats.mp / (user.data.stats.maxMP / 100);
    const hp = user.data.stats.hp / (user.data.stats.maxHealth / 100) > 100 ? 100 : user.data.stats.hp / (user.data.stats.maxHealth / 100);

    return (
      <div class={this.isSelectedUser() ? 'card blue' : 'card'}>
        <div class="content">
          <div class="header">{user.data.profile.name}</div>
          <div class="meta">
            Lvl {user.data.stats.lvl} <span class="label label-info">{User.parseUserClass(user.data.stats.class)}</span>
            <span data-tooltip="Gold" style="color:#b58105"><i class="dollar icon"></i>{parseInt(user.data.stats.gp)}</span>
            <span data-tooltip="Pending damage"><i class="bomb icon"></i>{user.damage}</span>
          </div>
          <div class="description">
            <div class="progress-container">
              <div class="progress">
                <div class="progress-bar bg-health" style={'transition-duration: 300ms; width:' + hp + '%;'}></div>
              </div>
              <div class="progress">
                <div class="progress-bar bg-mana" style={'transition-duration: 300ms; width:' + mp + '%;'}></div>
              </div>
            </div>
          </div>
        </div>
        <div class="extra content">
          <a class="left floated" onClick={this.selectUser}><i class="info icon"></i>{this.isSelectedUser() ? 'Deselect' : 'Select'}</a>
          <a class="right floated" onClick={this.removeUser}><i class="trash icon"></i>Remove</a>
        </div>
      </div>
    );
  }

  isSelectedUser() {
    return this.props.user.isInfoUser;
  }

  removeUser = () => {
    this.props.user.store.removeUser(this.props.user);
  }

  selectUser = () => {
    if (this.isSelectedUser()) {
      this.props.user.store.removeInfoUser(this.props.user);
    }
    else {
      this.props.user.store.addInfoUser(this.props.user);
    }
  }

  static parseUserClass(userClass) {
    return userClass === 'wizard' ? 'mage' : userClass;
  }
}

export default User;
