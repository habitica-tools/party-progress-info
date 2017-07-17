import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import SettingsInput from './SettingsInput';
require('preact/devtools');

@observer
class Settings extends Component {

    render({store}) {
        return (
            store.loadingobjects ? <div></div> :
            <div>
                <SettingsInput />
                <ul>
                    {store.users.map(u => u.loading ? <li>Loading...</li> : <li>{u.data.profile.name}</li> )}
                </ul>
            </div>
            );
    }


}


export default Settings;