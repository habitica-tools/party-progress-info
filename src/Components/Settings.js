import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import SettingsInput from './SettingsInput';
import User from './User';

@observer
class Settings extends Component {

    render({store}) {
        return (
            store.loadingobjects ? <div class="ui active centered inline loader"></div> :
            <div>
                <SettingsInput store={store} />
                <div class="ui basic segment"></div>
                <div class="ui cards">
                    {store.users.map(u => u.loading ? <div class="ui active centered inline loader"></div> : <User user={u} /> )}
                </div>
            </div>
            );
    }


}


export default Settings;