import { h, render, Component } from 'preact';
import { observable, action } from 'mobx';
import { observer } from 'mobx-preact';


@observer
class SettingsInput extends Component {
	@observable input="";
	 
    render() {
        return (
		<div class="ui right labeled input">
			<input
				className="new-user"
				placeholder="Give In UserId"
				autoFocus={true} value={this.input} onChange={this.onChange} />
			<button class="ui blue button" onClick={this.AddUser}>Add</button>
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