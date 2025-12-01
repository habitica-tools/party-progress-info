import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class HatchingPotionInfo extends Component {
  render() {
    const { store, category } = this.props;

    return (
      <div class="ui mini modal active">
        <div class="header">{category}
          <button class="ui icon right floated button" onClick={this.Close}>
            <i class="close icon" />
          </button>
        </div>
        <div class="content">
          {[...store.premiumhatchingpotions].filter(([id, potion]) => potion.id === category)
            .map(([id, potion]) => (
              potion.users.slice()
                .sort((a, b) => {
                  if (potion.usercount(a) > potion.usercount(b)) {
                    return -1;
                  }
                  if (potion.usercount(a) < potion.usercount(b)) {
                    return 1;
                  }
                  return 0;
                })
                .map((user) => (
                  <div key={user.id}>
                    {user.data.profile.name + ' has ' + potion.usercount(user)}
                  </div>
                ))
            ))
          }
        </div>
      </div>
    );
  }

  Close = (e) => {
    this.props.potionlist.hidePotionInfo();
  }
}

export default HatchingPotionInfo;
