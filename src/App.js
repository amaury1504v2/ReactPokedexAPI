import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/layout/NavBar';
import Dashboard from './components/layout/Dashboard';
import Pokemon from './components/pokemon/Pokemon';

import backgroundImage from './pattern.png';


function App() {
  return (
    <Router>
      <div className="App" style={{ background: `url(${backgroundImage})`}}>
        <NavBar />
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/pokemon/:pokemonIndex" element={<Pokemon />} /> 
            {/* :pokemonIndex est un paramètre de la route qui redirige vers l'élément Pokemon */}
          </Routes>
        </div>
    </div>
    </Router>
  );
}

export default App;
