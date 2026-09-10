import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
