import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Register(){
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [role, setRole] = useState("student")
    const [faculty, setFaculty] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleRegister = async (e)=>{
        e.preventDefault()
        if (isSubmitting) return
        setErrorMsg("")

        if (!email.endsWith("@ucu.ac.ug")) {
            setErrorMsg("Email must be a valid UCU email (e.g., student@ucu.ac.ug)");
            return;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+£[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMsg("Password must be at least 8 characters with letters, numbers, and special characters (e.g., !, @).");
            return;
        }

        setIsSubmitting(true)
        setErrorMsg("")
        try {
            await register({
                name,
                email,
                password,
                role,
                faculty
            })
            navigate("/dashboard")
        } catch (err) {
            setErrorMsg(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <div className="glass-panel fade-in" style={{ maxWidth: '450px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an Account</h2>
            {errorMsg && (
                <div style={{ padding: '0.875rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#b91c1c', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                    {errorMsg}
                </div>
            )}
            <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input 
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        placeholder="e.g. name@ucu.ac.ug"
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        placeholder="Create Password"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select 
                        value={role}
                        onChange={(e)=>setRole(e.target.value)}
                        className="auth-select"
                        required
                    >
                        <option value="student">Student</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Faculty (optional)</label>
                    <input 
                        placeholder="Enter your faculty"
                        value={faculty}
                        onChange={(e)=>setFaculty(e.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn-gradient" 
                    style={{ marginTop: '1rem', width: '100%', cursor: isSubmitting ? 'wait' : 'pointer', pointerEvents: 'auto' }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Already have an account? <span className="link" onClick={() => navigate("/")}>Sign in</span>
            </p>
        </div>
    )

}

export default Register
