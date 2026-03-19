import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import SubmitProject from "./pages/SubmitProject"
import Projects from "./pages/Projects"
import AdminDashboard from "./pages/AdminDashboard"
import Supervisor from "./pages/Supervisor"

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/supervisor" element={<Supervisor />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App