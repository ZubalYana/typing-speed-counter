import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import AlertSnackbar from './components/AlertSnackbar'
import UserProfile from './components/UserProfile'
import TypingTest from './components/Typing'
import PageLayout from './components/PageLayout'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminPanel />
          </ProtectedAdminRoute>
        } />
        <Route path="/" element={<PageLayout><TypingTest /></PageLayout>} />
        <Route path="/profile" element={<PageLayout><UserProfile /></PageLayout>} />
      </Routes>
      <AlertSnackbar />
    </Router>
  )
}

export default App
