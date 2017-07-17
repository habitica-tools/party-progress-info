import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Settings from './Settings';
import QuestList from './QuestList';
require('preact/devtools');

@observer
class App extends Component {

  render({store}) {
    return (
      <div>
        <div>
          <Settings store={store}/>
        </div>
        <div>
          <QuestList store={store}/>
        </div>
      </div>
    );
  }

};


export default App;