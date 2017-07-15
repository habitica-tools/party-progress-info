import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
require('preact/devtools');

@observer
class App extends Component {

  render() {
    return (
      <div>
        <button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>
       <div>{this.props.appState.data}</div>
      </div>
    );
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }
};


export default App;