import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

function Login(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e)=>{
        e.preventDefault()
        setError("")
        setLoading(true)
        try{
            await login(email, password)
            navigate("/dashboard")
        }catch(err){
            setError(err.response?.data?.message || "Invalid email or password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    UCU Innovators Hub
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Sign in to manage your innovations</p>
            </div>
            <div className="glass-panel" style={{ maxWidth: '420px', width: '100%' }}>
                <h2>Welcome Back</h2>
                {error && (
                    <div className="alert-error" style={{ padding: '0.875rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#b91c1c', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="name@ucu.ac.ug"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-gradient" style={{ width: '100%' }} disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" className="link">Create one</Link>
                </p>
            </div>
        </div>
    )

}

export default Login
