/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App.tsx';

const root = document.createElement('div');
document.body.append(root);

render(() => <App />, root);
