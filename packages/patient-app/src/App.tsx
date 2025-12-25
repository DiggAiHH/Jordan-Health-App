import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BloodGlucose } from './pages/BloodGlucose';
import { AddReading } from './pages/AddReading';
import { Chat } from './pages/Chat';
import { History } from './pages/History';
import { LocaleProvider } from './hooks/useAppLocale';

/**
 * Patient App Hauptkomponente
 * Einfache Navigation für geriatrische Patienten
 */
function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/glucose" element={<BloodGlucose />} />
            <Route path="/glucose/add" element={<AddReading />} />
            <Route path="/history" element={<History />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LocaleProvider>
  );
}

export default App;
