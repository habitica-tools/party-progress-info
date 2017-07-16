import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import SettingsInput from './SettingsInput';
require('preact/devtools');

@observer
class Settings extends Component {

    render() {
        return (
            <div>
                <SettingsInput/>
                <ul>
                    <li></li>
                </ul>
            </div>
            );
    }


}


export default Settings;