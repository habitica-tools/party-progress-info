import { h, render } from 'preact';
import AppStore from './Stores/AppStore';
import App from './Components/App';
import { useStrict } from 'mobx';

useStrict(true);
const store = new AppStore();

render(
  <App store={store} />,
  document.getElementById('root')
);

window.onpopstate = function (event) {
  store.loadQueryString();
}