import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function Home() {
  return <h1>Welcome Home</h1>;
}

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
