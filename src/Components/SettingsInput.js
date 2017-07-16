import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
require('preact/devtools');

@observer
class SettingsInput extends Component {

    render() {
        return (
		<div>
			<input
				className="new-user"
				placeholder="Give In UserId"
				autoFocus={true} />
			<button onClick={this.AddUser} value="Add"/>
		</div>
		);
	}
	
	AddUser = () => {
        
    }
}


export default SettingsInput;