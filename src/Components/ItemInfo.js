import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class ItemInfo extends Component {
  render() {
    const { item } = this.props;

    return (
      <div class="ui mini modal active">
        <div class="header">{item.tooltip}
          <button class="ui icon right floated button" onClick={this.close}>
            <i class="close icon" />
          </button>
        </div>
        <div class="content">
          {item.users.slice()
            .sort((userA, userB) => item.userCount(userB) - item.userCount(userA))
            .map((user) => (
              <div key={user.id}>
                {user.data.profile.name + ' has ' + item.userCount(user)}
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  close = () => {
    this.props.itemList.hideInfo();
  }
}

export default ItemInfo;
