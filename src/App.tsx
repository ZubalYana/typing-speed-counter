import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Typing from './components/Typing'
import Auth from './components/Auth'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Typing />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App
