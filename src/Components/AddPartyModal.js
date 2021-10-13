import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action } from 'mobx';

@observer
class AddPartyModal extends Component {
	@observable userId="";
	@observable key="";

    render({store, userId}) {
        this.populateUserId(userId);
        return (
        <div class="ui mini modal active">
            <div class="header">Add Party
            <button class="ui icon right floated button" onClick={this.Close}>
                <i class="close icon"></i>
            </button>
            </div>
            <div class="content">
                <label>User ID: </label>
                <input
                    className="user-id"
                    autoFocus={true} value={this.userId} onChange={this.onUserIdChange}
                /><p/>
                <label>API Token: </label>
                <input
                    className="user-key"
                    type="password"
                    autoFocus={true} value={this.key} onChange={this.onKeyChange}
                />
                <p/>
                <div class="ui blue button" onClick={this.AddParty}><i class="users icon"></i> Add</div>
                <div class="ui icon right floated button" data-tooltip="Or use the bookmark method described on the Help &amp; About page." data-position="right center"
                onClick={this.gotoAbout}>
                    <i class="info icon"></i>
                </div>
            </div>
        </div>
        );
    }


    gotoAbout = () => {
        this.props.store.gotoAbout();
    }  

	@action populateUserId = (userId) => {
		this.userId = userId;
	}

	@action onUserIdChange = (e) => {
		this.userId = e.target.value;
	}

	@action onKeyChange = (e) => {
		this.key = e.target.value;
	}

	@action AddParty = () => {
		this.props.store.addParty(this.userId, this.key);
		this.userId = "";
        this.key = "";
        this.emptyUserIdInParent();
        this.Close();
    }

    Close = (e) => {
        this.props.parent.hideAddPartyModal();
    }

    emptyUserIdInParent = (e) => {
        this.props.parent.clearInput();
    }
}


export default AddPartyModal;