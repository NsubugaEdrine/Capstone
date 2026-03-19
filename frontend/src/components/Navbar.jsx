import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <nav className="navbar">
            <Link to={user ? "/dashboard" : "/"} className="nav-brand">
                UCU Innovators Hub
            </Link>
            
            <div className="nav-links">
                <Link to="/projects" className="nav-link">Gallery</Link>
                
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        {user.role === 'student' && <Link to="/submit" className="nav-link">Submit Project</Link>}
                        {user.role === 'admin' && <Link to="/admin" className="nav-link">Analytics</Link>}
                        {user.role === 'supervisor' && <Link to="/supervisor" className="nav-link">Supervisor</Link>}
                        <button onClick={handleLogout} className="nav-logout">Log Out ({user.name})</button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-link">Sign In</Link>
                        <Link to="/register" className="btn-gradient" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
