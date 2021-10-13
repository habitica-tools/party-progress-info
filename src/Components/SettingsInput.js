import { h, render, Component } from 'preact';
import { observable, action } from 'mobx';
import { observer } from 'mobx-preact';
import AddPartyModal from './AddPartyModal';


@observer
class SettingsInput extends Component {
	@observable input="";
    @observable addingParty = false;
	 
    render({store}) {
        return (
		<div class="ui fluid action input">
			<input
				className="new-user"
				placeholder="Give In UserId ex: f600354c-9d34-4a4c-a38d-cae52cf58705"
				autoFocus={true} value={this.input} onChange={this.onChange} />
			<div class="ui blue button" onClick={this.AddUser}><i class="user icon"></i> Add</div>
			&nbsp;
			<div class="ui blue button" onClick={this.openAddPartyModal}><i class="users icon"></i> Add Party</div>
			<div class="column">
				{!this.addingParty ? <br/> :
					<AddPartyModal store={store} userId={this.input} parent={this} />
				}
			</div>
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

	@action openAddPartyModal = () => {
		this.addingParty = true;
    }

    @action hideAddPartyModal() {
        this.addingParty = false;
    }

	@action clearInput() {
		this.input = "";
	}
}


export default SettingsInput;