import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './AppRouter'

import 'antd/dist/antd.css'
import './App.css'
import ErrorBoundary from './components/commons/ErrorBoundary'

function App() {
  return (
    <div className="App">
      <Router>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </Router>
    </div>
  )
}

export default App;
