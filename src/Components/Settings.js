import { Component } from 'preact';
import { observer } from 'mobx-react';

import SettingsInput from './SettingsInput';
import User from './User';

@observer
class Settings extends Component {
  render() {
    const { store } = this.props;

    return (
      store.loadingobjects ? <div class="ui active centered inline loader"></div> : (
        <div>
          <SettingsInput store={store} /><br />
          <div class="ui fluid container">
            <div class="ui horizontal divider header">
              <h5>
                <span data-tooltip="Users" style="color:#0082E2"><i class="user icon"></i>
                  {store.users.length}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span data-tooltip="Total pending damage" style="color:#646464"><i class="bomb icon"></i>
                  {store.users.map((u) => (u.loading || u.invalid ? 0 : u.damage)).reduce((a, b) => a + b, 0)}
                </span>
              </h5>
            </div>
          </div>
          <br />
          <div class="ui cards">
            {store.users.map((u) => <User user={u} />)}
          </div>
          <br />
        </div>
      )
    );
  }
}

export default Settings;
