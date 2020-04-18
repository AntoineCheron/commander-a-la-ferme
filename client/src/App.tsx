import React from 'react'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
}

export default App;
