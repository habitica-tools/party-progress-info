import { Component } from 'preact';
import { action } from 'mobx';
import { observer } from 'mobx-react';

@observer
class AuthenticationModal extends Component {
  constructor() {
    super();
    this.state = { userId: '', key: '' }
  }

  componentDidMount() {
    this.setState({ userId: this.props.userId });
  }

  render() {
    return (
      <div class="ui mini modal active">
        <div class="header">Authenticate</div>
        <div class="content">
          <label>User ID: </label>
          <input
            className="user-id"
            maxLength={37}
            autoFocus={true}
            value={this.state.userId}
            onChange={this.onUserIdChange}
          /><p />
          <label>API Token: </label>
          <input
            className="user-key"
            type="password"
            maxLength={37}
            value={this.state.key}
            onChange={this.onKeyChange}
            onKeyDown={(this.userAndKeyAreValid ? this.onKeyDown : null)}
          />
          <p />
          <div
            onClick={this.addAuth}
            class={'ui blue button' + (this.userAndKeyAreValid ? '' : ' disabled')}
          ><i class="users icon"></i> Authenticate</div>
          <div style="white-space: pre-line;" class="ui icon right floated button" data-bs-html="true" data-tooltip="Habitica API does not allow fetching user info without authentication any more.&#xa;You can find your User ID and API Token in Habitica.com -> User -> Settings -> Site Data.&#xa;Your credentials are not saved, this modal will pop up again after site refresh." data-position="right center">
            <i class="info icon"></i>
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
