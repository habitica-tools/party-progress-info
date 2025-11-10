import { h, render } from 'preact';
import AppStore from './Stores/AppStore';
import App from './Components/App';
import { configure } from 'mobx';

configure({ enforceActions: "observed" });
const store = new AppStore();

render(
  <App store={store} />,
  document.getElementById('root')
);

window.onpopstate = function (event) {
  store.loadQueryString();
}