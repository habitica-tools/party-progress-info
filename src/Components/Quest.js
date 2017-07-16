import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
require('preact/devtools');

@observer
class Quest extends Component {

    render({key, text}) {
        return (
            <li>
               {key} - {text}
            </li>
        );
    }
}


export default Quest;