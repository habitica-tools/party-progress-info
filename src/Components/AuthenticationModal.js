import { Component } from 'preact';
import { action } from 'mobx';
import { observer } from 'mobx-react';

@observer
class AuthenticationModal extends Component {
  constructor() {
    super();
    this.state = { userId: '', key: '' }
  }

  render() {
    return (
      <div class="ui mini modal active">
        <div class="header">Credentials for Habitica API</div>
        <div class="content">
          <div class="ui stackable grid">
            <div class="five wide column">
              <label>User ID </label>
            </div>
            <div class="eleven wide column" style="padding-bottom: 0rem;">
              <input
                className="user-id"
                maxLength={37}
                autoFocus={true}
                value={this.state.userId}
                onChange={this.onUserIdChange}
                style="width:100%;"
              />
            </div>
          </div>
          <div class="ui stackable grid">
            <div class="five wide column">
              <label>API Token </label>
            </div>
            <div class="eleven wide column">
              <input
                className="api-token"
                type="password"
                maxLength={37}
                value={this.state.key}
                onChange={this.onKeyChange}
                onKeyDown={(this.userAndKeyAreValid ? this.onKeyDown : null)}
                style="width:100%;"
              />
            </div>
          </div>
          <p />
          <div>
            <div onClick={this.addAuth} class={'ui blue button' + (this.userAndKeyAreValid ? '' : ' disabled')}>
              <i class="users icon" /> Authenticate
            </div>
            <div style="white-space: pre-line;" class="ui icon right floated button" data-bs-html="true" data-tooltip="This tool needs credentials to retrieve user data from the Habitica API.&#xa;They can be found in your Habitica profile under User -> Settings -> Site Data.&#xa;This tool will save your credentials and this dialog will reappear after site refresh." data-position="right center">
              <i class="info icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  get userAndKeyAreValid() {
    return (
      this.props.store.api.isValidToken(this.state.userId)
      && this.props.store.api.isValidToken(this.state.key)
    );
  }

  @action onUserIdChange = (e) => {
    this.setState({ userId: e.target.value });
  }

  @action onKeyChange = (e) => {
    this.setState({ key: e.target.value });
  }

  @action onKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.addAuth();
    }
  }

  @action addAuth = () => {
    this.props.store.api.setCredentials(this.state.userId, this.state.key);

    this.props.store.reloadUsers();
    this.props.store.addUser(this.state.userId);

    this.setState({ userId: '', key: '' });
  }
}

export default AuthenticationModal;
