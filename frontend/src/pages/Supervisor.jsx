import { useState, useEffect } from "react"
import API from "../services/api"

function Supervisor() {
    const [pendingProjects, setPendingProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)

    useEffect(() => {
        fetchPendingProjects()
    }, [])

    const fetchPendingProjects = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await API.get("/projects", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const pending = (res.data || []).filter(p => p.status === "pending")
            setPendingProjects(pending)
        } catch (error) {
            console.error("Failed to fetch projects", error)
            alert("Failed to load projects")
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (projectId) => {
        setActionLoading(projectId)
        try {
            const token = localStorage.getItem("token")
            await API.put(`/projects/approve/${projectId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("Project approved successfully")
            fetchPendingProjects()
        } catch (error) {
            alert(error.response?.data?.error || "Failed to approve")
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (projectId) => {
        setActionLoading(projectId)
        try {
            const token = localStorage.getItem("token")
            await API.put(`/projects/reject/${projectId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("Project rejected")
            fetchPendingProjects()
        } catch (error) {
            alert(error.response?.data?.error || "Failed to reject")
        } finally {
            setActionLoading(null)
        }
    }

    const getUploadUrl = (filename) => {
        const baseURL = API.defaults.baseURL || "http://localhost:5000/api"
        const hostURL = baseURL.replace(/\/api\/?$/, "")
        return `${hostURL}/uploads/${filename}`
    }

    if (loading) {
        return <div className="loading-state">Loading pending projects...</div>
    }

    return (
        <div className="supervisor-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            <h1 className="gallery-title" style={{ marginBottom: "1rem" }}>Supervisor Dashboard</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                Review and approve or reject student project submissions.
            </p>

            {pendingProjects.length === 0 ? (
                <div className="glass-panel empty-state" style={{ textAlign: "center", padding: "3rem", borderStyle: "dashed" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}>✓</div>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", margin: 0 }}>
                        No projects pending review. All caught up!
                    </p>
                </div>
            ) : (
                <div className="projects-grid" style={{ gap: "1.5rem" }}>
                    {pendingProjects.map((project) => (
                        <div key={project.id} className="project-card glass-panel">
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <div className="project-meta">
                                {project.category && <span className="badge">{project.category}</span>}
                                {project.faculty && <span className="badge">{project.faculty}</span>}
                                {project.technology && <span className="badge tech">{project.technology}</span>}
                            </div>
                            {project.github_link && (
                                <p style={{ marginBottom: "0.5rem" }}>
                                    <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                                        GitHub →
                                    </a>
                                </p>
                            )}
                            {project.document && (
                                <p style={{ marginBottom: "1rem" }}>
                                    <a href={getUploadUrl(project.document)} target="_blank" rel="noopener noreferrer">
                                        View Document →
                                    </a>
                                </p>
                            )}
                            <div className="project-actions" style={{ marginTop: "1rem" }}>
                                <button
                                    className="btn-gradient"
                                    style={{ flex: 1 }}
                                    onClick={() => handleApprove(project.id)}
                                    disabled={actionLoading === project.id}
                                >
                                    {actionLoading === project.id ? "..." : "✓ Approve"}
                                </button>
                                <button
                                    className="btn-outline"
                                    style={{ flex: 1, color: "#ef4444", borderColor: "#ef4444" }}
                                    onClick={() => handleReject(project.id)}
                                    disabled={actionLoading === project.id}
                                >
                                    {actionLoading === project.id ? "..." : "✗ Reject"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Supervisor
