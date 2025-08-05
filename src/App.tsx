import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import AlertSnackbar from './components/AlertSnackbar'
import UserProfile from './components/UserProfile'
import TypingTest from './components/Typing'
import PageLayout from './components/PageLayout'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageLayout><TypingTest /></PageLayout>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<PageLayout><UserProfile /></PageLayout>} />
      </Routes>
      <AlertSnackbar />
    </Router>
  )
}

export default App
