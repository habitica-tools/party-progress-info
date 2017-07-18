import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import SettingsInput from './SettingsInput';
import User from './User';
require('preact/devtools');

@observer
class Settings extends Component {

    render({store}) {
        return (
            store.loadingobjects ? <div></div> :
            <div>
                <SettingsInput store={store} />
                <ul>
                    {store.users.map(u => u.loading ? <li>Loading...</li> : <User user={u} /> )}
                </ul>
            </div>
            );
    }


}


export default Settings;