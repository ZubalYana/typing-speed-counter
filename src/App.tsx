import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import AlertSnackbar from './components/AlertSnackbar'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <AlertSnackbar />
    </Router>
  )
}

export default App
