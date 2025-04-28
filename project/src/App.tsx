import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MessageGeneratorPage from './pages/MessageGeneratorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/generate-message" element={<MessageGeneratorPage />} />
      </Routes>
    </Router>
  );
}

export default App;