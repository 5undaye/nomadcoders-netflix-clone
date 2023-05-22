import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/movie/:movieId" element={<Home />} />
        </Route>
        <Route path="/show" element={<Tv />}>
          <Route path="/show/:showId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
