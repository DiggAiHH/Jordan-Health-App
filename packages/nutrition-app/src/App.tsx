import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddMeal } from './pages/AddMeal';
import { MealHistory } from './pages/MealHistory';
import { LocaleProvider } from './hooks/useAppLocale';

/**
 * Nutrition App - Mahlzeiten-Tracking für Diabetes-Patienten
 */
function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddMeal />} />
            <Route path="/history" element={<MealHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LocaleProvider>
  );
}

export default App;
