import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Dashboard() {
    const { user } = useAuth()

    return (
        <div className="fade-in">
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                Welcome back, <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name || 'Innovator'}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
                Manage your projects and explore innovations from the hub.
            </p>

            <div className="dashboard-grid">
                <Link to="/submit" className="glass-panel dash-card">
                    <div className="icon">🚀</div>
                    <h3>Submit Project</h3>
                    <p>Upload your latest innovation or prototype.</p>
                </Link>

                <Link to="/projects" className="glass-panel dash-card">
                    <div className="icon">🌍</div>
                    <h3>Gallery</h3>
                    <p>Discover approved projects from other students.</p>
                </Link>

                {user?.role === 'supervisor' && (
                    <Link to="/supervisor" className="glass-panel dash-card" style={{ borderColor: 'var(--secondary-color)' }}>
                        <div className="icon">✅</div>
                        <h3>Review Projects</h3>
                        <p>Approve or reject student submissions.</p>
                    </Link>
                )}
                {user?.role === 'admin' && (
                    <Link to="/admin" className="glass-panel dash-card" style={{ borderColor: 'var(--secondary-color)' }}>
                        <div className="icon">📊</div>
                        <h3>Analytics</h3>
                        <p>View system-wide statistics and trends.</p>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Dashboard