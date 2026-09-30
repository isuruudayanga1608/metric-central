import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDashboardPage from './pages/ActivityDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/activities/:activityId" element={<ActivityDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
