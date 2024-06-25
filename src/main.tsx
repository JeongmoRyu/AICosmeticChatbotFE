import { RecoilRoot } from 'recoil';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'assets/styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
)
