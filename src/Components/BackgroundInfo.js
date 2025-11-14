import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class BackgroundInfo extends Component {
  render() {
    const store = this.props.store;
    const category = this.props.category;

    return (
      <div>
        {[...store.backgrounds].filter(([id, background]) => background.id === category)
          .map(([id, background]) =>
            <div class="ui mini modal active">
              <div class="header">{background.data.text}
                <button class="ui icon right floated button" onClick={this.Close}>
                  <i class="close icon"></i>
                </button>
              </div>
              <div class="content">
                {background.users.map(user => user.data.profile.name).join(', ')}
              </div>
            </div>
          )}
      </div>
    );

  }

  Close = (e) => {
    this.props.backgroundlist.hideBackgroundInfo();
  }
}


export default BackgroundInfo;