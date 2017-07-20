import { h, render, Component } from 'preact';
import { observable, action } from 'mobx';
import { observer } from 'mobx-preact';


@observer
class SettingsInput extends Component {
	@observable input="";
	 
    render() {
        return (
		<div class="ui fluid action input">
			<input
				className="new-user"
				placeholder="Give In UserId ex: f600354c-9d34-4a4c-a38d-cae52cf58705"
				autoFocus={true} value={this.input} onChange={this.onChange} />
			<div class="ui blue button" onClick={this.AddUser}><i class="user icon"></i> Add</div>
		</div>
		);
	}
	@action onChange = (e) => {
		this.input = e.target.value;
	}
	@action AddUser = () => {
		this.props.store.addUser(this.input);
		this.input = "";
    }
}


export default SettingsInput;