import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LocomotiveScrollWrapper from "./components/LocomotiveScrollWrapper";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./components/Home.jsx";
import ExploreBikes from "./components/ExploreBikes.jsx";
import Search from "./pages/Search.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <Router>
      <LocomotiveScrollWrapper>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExploreBikes />} />
            <Route path="/search" element={<Search />} />
          </Routes>
          <Footer />
        </div>
      </LocomotiveScrollWrapper>
    </Router>
  );
}

export default App;
