import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRouter from 'routers';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      {/* <ScrollToTop /> */}
      <ToastContainer toastStyle={{ backgroundColor: '#4d5562' }} />
    </BrowserRouter>
  );
}

export default App;
