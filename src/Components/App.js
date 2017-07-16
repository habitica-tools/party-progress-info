import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import Settings from './Settings';
import QuestList from './QuestList';
require('preact/devtools');

@observer
class App extends Component {

  render() {
    return (
      <div>
        <div>
          <Settings/>
        </div>
        <div>
          <QuestList common={this.props.appState.habiticaobjects} loading={this.props.appState.loadingobjects}/>
        </div>
      </div>
    );
  }

};


export default App;