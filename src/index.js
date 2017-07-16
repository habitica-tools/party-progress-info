import { h, render } from 'preact';
import AppState from './Models/AppState';
import App from './Components/App';

const appState = new AppState();

render(
    <App appState={appState} />,
  document.getElementById('root')
);
