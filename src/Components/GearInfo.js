import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class GearInfo extends Component {
  render() {
    const { store, category } = this.props;

    return (
      <div>
        {[...store.gear].filter(([id, gear]) => gear.id === category)
          .map(([id, gear]) => (
            <div class="ui mini modal active">
              <div class="header">{gear.data.text}
                <button class="ui icon right floated button" onClick={this.Close}>
                  <i class="close icon"></i>
                </button>
              </div>
              <div class="content">
                {gear.users.map((user) => user.data.profile.name).join(', ')}
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  Close = (e) => {
    this.props.gearlist.hideGearInfo();
  }
}

export default GearInfo;
