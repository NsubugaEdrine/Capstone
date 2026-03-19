import { useState, useEffect } from "react"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"

function Projects() {
    const { user } = useAuth()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [technology, setTechnology] = useState("")
    const [faculty, setFaculty] = useState("")
    const [year, setYear] = useState("")

    // Comment Modal State
    const [selectedProject, setSelectedProject] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [loadingComments, setLoadingComments] = useState(false)
    // Project Detail Modal
    const [detailProject, setDetailProject] = useState(null)

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (search) params.append("search", search)
                if (category) params.append("category", category)
                if (technology) params.append("technology", technology)
                if (faculty) params.append("faculty", faculty)
                if (year) params.append("year", year)
                
                const res = await API.get(`/projects/approved?${params.toString()}`)
                setProjects(res.data)
            } catch (error) {
                console.error("Failed to fetch projects", error)
            } finally {
                setLoading(false)
            }
        }
        
        const timer = setTimeout(() => {
            fetchProjects()
        }, 300)
        
        return () => clearTimeout(timer)
    }, [search, category, technology, faculty, year])

    const getUploadUrl = (filename) => {
        const baseURL = API.defaults.baseURL || "http://localhost:5000/api";
        const hostURL = baseURL.replace(/\/api\/?$/, "");
        return `${hostURL}/uploads/${filename}`;
    }

    const openComments = async (project) => {
        setSelectedProject(project)
        setLoadingComments(true)
        try {
            const res = await API.get(`/comments/${project.id}`)
            setComments(res.data)
        } catch (error) {
            console.error("Failed to fetch comments", error)
        } finally {
            setLoadingComments(false)
        }
    }

    const closeComments = () => {
        setSelectedProject(null)
        setComments([])
        setNewComment("")
    }

    const openProjectDetail = async (project) => {
        try {
            const res = await API.get(`/projects/approved/${project.id}`)
            setDetailProject(res.data)
        } catch (error) {
            setDetailProject({ ...project, student_name: "Unknown" })
        }
    }

    const closeDetail = () => setDetailProject(null)

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const token = localStorage.getItem("token")
            await API.post("/comments/add", 
                { project_id: selectedProject.id, comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            // Refresh comments exactly after posting
            const res = await API.get(`/comments/${selectedProject.id}`)
            setComments(res.data)
            setNewComment("")
        } catch (error) {
            alert("Failed to submit comment. Ensure you are logged in.")
        }
    }

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h1 className="gallery-title">Innovation Gallery</h1>
                <p className="gallery-subtitle">Discover and explore cutting-edge projects from UCU innovators.</p>
            </div>

            <div className="controls-section">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search by title or description..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    className="filter-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="IoT">IoT</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other">Other</option>
                </select>
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Filter by faculty" 
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                />
                <select 
                    className="filter-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">All Years</option>
                    {[2025, 2024, 2023, 2022, 2021].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Filter by tech (e.g., React, JS)" 
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                />
            </div>

            {loading && projects.length === 0 ? (
                <div className="loading-state">Loading amazing innovations...</div>
            ) : (
                <div className="projects-grid">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project.id} className="project-card">
                                <h3 className="project-title" style={{ cursor: "pointer" }} onClick={() => openProjectDetail(project)}>
                                    {project.title}
                                </h3>
                                <p className="project-description">{project.description}</p>
                                
                                <div className="project-meta">
                                    {project.category && <span className="badge">{project.category}</span>}
                                    {project.faculty && <span className="badge">{project.faculty}</span>}
                                    {project.technology && <span className="badge tech">{project.technology}</span>}
                                </div>
                                
                                <div className="project-actions">
                                    <button onClick={() => openProjectDetail(project)} className="btn btn-outline" style={{ flex: 0.5 }}>
                                        Details
                                    </button>
                                    {project.github_link && (
                                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 0.5 }}>
                                            Code
                                        </a>
                                    )}
                                    {project.document && (
                                        <a href={getUploadUrl(project.document)} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 0.5 }}>
                                            Docs
                                        </a>
                                    )}
                                    <button onClick={() => openComments(project)} className="btn btn-primary" style={{ flex: 1 }}>
                                        Feedback 💬
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            No projects found matching your criteria. Try adjusting your search!
                        </div>
                    )}
                </div>
            )}

            {/* Project Detail Modal */}
            {detailProject && (
                <div className="modal-overlay" onClick={closeDetail}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
                        <div className="modal-header">
                            <h2>{detailProject.title}</h2>
                            <button className="close-btn" onClick={closeDetail}>&times;</button>
                        </div>
                        <div className="comments-list">
                            <p><strong>Description:</strong></p>
                            <p style={{ marginBottom: "1rem" }}>{detailProject.description}</p>
                            <p><strong>Team / Innovator:</strong> {detailProject.student_name || "Unknown"}</p>
                            <div className="project-meta" style={{ marginTop: "1rem" }}>
                                {detailProject.category && <span className="badge">{detailProject.category}</span>}
                                {detailProject.faculty && <span className="badge">{detailProject.faculty}</span>}
                                {detailProject.technology && <span className="badge tech">{detailProject.technology}</span>}
                            </div>
                            {detailProject.github_link && (
                                <p style={{ marginTop: "1rem" }}>
                                    <a href={detailProject.github_link} target="_blank" rel="noopener noreferrer">GitHub Repository →</a>
                                </p>
                            )}
                            {detailProject.document && (
                                <p>
                                    <a href={getUploadUrl(detailProject.document)} target="_blank" rel="noopener noreferrer">Project Document (PDF) →</a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Modal Overlay */}
            {selectedProject && (
                <div className="modal-overlay" onClick={closeComments}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedProject.title} - Discussion</h2>
                            <button className="close-btn" onClick={closeComments}>&times;</button>
                        </div>
                        
                        <div className="comments-list">
                            {loadingComments ? (
                                <p>Loading feedback...</p>
                            ) : comments.length > 0 ? (
                                comments.map(c => (
                                    <div key={c.id} className="comment-bubble">
                                        <strong>{c.user_name}</strong>
                                        <span className="comment-date">{new Date(c.created_at).toLocaleDateString()}</span>
                                        <p style={{ margin: 0 }}>{c.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments">No feedback yet. Be the first to comment!</p>
                            )}
                        </div>

                        {user ? (
                            <form className="comment-form" onSubmit={handleCommentSubmit}>
                                <textarea 
                                    placeholder="Leave constructive feedback or ask a question..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Post Comment</button>
                            </form>
                        ) : (
                            <div className="login-prompt">
                                <p>You must be signed in to leave feedback.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Projects
