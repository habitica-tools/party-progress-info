import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class EggInfo extends Component {
  render() {
    const egg = this.props.egg;

    return (
      <div class="ui mini modal active">
        <div class="header">{egg.id}
          <button class="ui icon right floated button" onClick={this.close}>
            <i class="close icon"></i>
          </button>
        </div>
        <div class="content">
          {
            egg.users.slice()
              .sort((userA, userB) => egg.userCount(userB) - egg.userCount(userA))
              .map(user =>
                <div key={user.id}>
                  {user.data.profile.name + " has " + egg.userCount(user)}
                </div>
              )
          }
        </div>
      </div>
    );
  }

  close = () => {
    this.props.eggList.hideInfo();
  }
}

export default EggInfo;