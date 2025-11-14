import { h, render, Component } from 'preact';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
class SettingsInput extends Component {
  @observable accessor input = "";

  render() {
    const store = this.props.store;

    return (
      <div class="ui fluid action input">
        <input
          className="new-user"
          placeholder="Enter UserId, e.g. f600354c-9d34-4a4c-a38d-cae52cf58705"
          maxLength={37}
          autoFocus={true}
          value={this.input}
          onChange={this.onChange}
          onKeyDown={(this.inputIsValid ? this.onKeyDown : null)}
        />
        <div
          class={"ui blue button" + (this.inputIsValid ? "" : " disabled")}
          onClick={this.addUser}
        ><i class="user icon"></i> Add</div>
        &nbsp;
        <div
          class={"ui blue button" + (store.api.hasValidCredentials ? "" : " disabled")}
          onClick={this.addParty}
        ><i class="users icon"></i> Add Party</div>
      </div>
    );
  }

  get inputIsValid() {
    return this.props.store.api.isValidToken(this.input);
  }

  @action onChange = (e) => {
    this.input = e.target.value;
  }

  @action onKeyDown = (e) => {
    if (e.key === "Enter") {
      this.addUser();
    }
  }

  @action addUser = () => {
    this.props.store.addUser(this.input);
    this.input = "";
  }

  @action addParty = () => {
    this.props.store.addParty();
    this.input = "";
  }
}


export default SettingsInput;