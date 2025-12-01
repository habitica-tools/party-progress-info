import { configure } from 'mobx';
import { render } from 'preact';

import App from './Components/App';
import AppStore from './Stores/AppStore';

configure({ enforceActions: 'observed' });
const store = new AppStore();

render(
  <App store={store} />,
  document.getElementById('root'),
);

window.onpopstate = (event) => {
  store.loadQueryString();
}
