import SearchImage from './components/SearchImage';
import Editor from './components/Editor';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchImage />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
};

export default App;
