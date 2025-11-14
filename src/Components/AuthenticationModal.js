import { h, render, Component } from 'preact';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

@observer
class AuthenticationModal extends Component {

  constructor() {
    super();
    this.state = { userId: "", key: "" }
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
            autoFocus={true} value={this.state.userId} onChange={this.onUserIdChange}
          /><p />
          <label>API Token: </label>
          <input
            className="user-key"
            type="password"
            autoFocus={true} value={this.state.key} onChange={this.onKeyChange}
          />
          <p />
          <div class="ui blue button" onClick={this.AddAuth}><i class="users icon"></i> Authenticate</div>
          <div style="white-space: pre-line;" class="ui icon right floated button" data-bs-html="true" data-tooltip="Habitica API does not allow fetching user info without authentication any more.&#xa;You can find your User ID and API Token in Habitica.com -> User -> Settings -> Site Data.&#xa;Your credentials are not saved, this modal will pop up again after site refresh." data-position="right center">
            <i class="info icon"></i>
          </div>
        </div>
      </div>
    );
  }

  @action onUserIdChange = (e) => {
    this.setState({ userId: e.target.value });
  }

  @action onKeyChange = (e) => {
    this.setState({ key: e.target.value });
  }

  @action AddAuth = () => {
    this.props.store.addAuth(this.state.userId, this.state.key);
    this.setState({ userId: "", key: "" });

    this.props.store.reloadUsers();
  }
}


export default AuthenticationModal;