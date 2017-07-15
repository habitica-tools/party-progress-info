import { h, render } from 'preact';
import AppState from './AppState';
import App from './App';

const appState = new AppState();

render(
    <App appState={appState} />,
  document.getElementById('root')
);
