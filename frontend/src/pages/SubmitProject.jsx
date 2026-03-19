import { useState } from "react"
import API from "../services/api"

function SubmitProject(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [category,setCategory] = useState("")
const [faculty,setFaculty] = useState("")
const [technology,setTechnology] = useState("")
const [github,setGithub] = useState("")
const [file,setFile] = useState(null)
const [successMessage, setSuccessMessage] = useState("")
const [errorMessage, setErrorMessage] = useState("")
const [formKey, setFormKey] = useState(0)

const handleSubmit = async (e)=>{
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")

    const formData = new FormData()
    formData.append("title",title)
    formData.append("description",description)
    formData.append("category",category)
    formData.append("faculty",faculty)
    formData.append("technology",technology)
    formData.append("github_link",github)
    formData.append("document",file)

    try {
        const token = localStorage.getItem("token")
        await API.post("/projects/create", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        setSuccessMessage("Project submitted successfully! It will be reviewed by a supervisor.")
        setTitle("")
        setDescription("")
        setCategory("")
        setFaculty("")
        setTechnology("")
        setGithub("")
        setFile(null)
        setFormKey(k => k + 1)
    } catch (error) {
        setErrorMessage(error.response?.data?.error || "Submission failed. Please try again.")
    }
}

return(
    <div className="glass-panel fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Submit Innovation</h2>
        
        {successMessage && (
            <div style={{ 
                padding: '1rem 1.25rem', 
                background: 'rgba(16, 185, 129, 0.15)', 
                border: '1px solid #10b981', 
                borderRadius: '8px', 
                color: '#047857', 
                marginBottom: '1.5rem',
                fontWeight: 500
            }}>
                ✓ {successMessage}
            </div>
        )}
        {errorMessage && (
            <div style={{ 
                padding: '1rem 1.25rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid #ef4444', 
                borderRadius: '8px', 
                color: '#b91c1c', 
                marginBottom: '1.5rem',
                fontWeight: 500
            }}>
                ✗ {errorMessage}
            </div>
        )}
        
        <form key={formKey} onSubmit={handleSubmit} className="auth-form submit-form" style={{ maxWidth: '100%' }}>
            <div className="form-group">
                <label>Project Title</label>
                <input
                    type="text"
                    placeholder="e.g. AI Crop Disease Detector"
                    onChange={(e)=>setTitle(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Description</label>
                <textarea
                    placeholder="Describe the problem and your solution..."
                    onChange={(e)=>setDescription(e.target.value)}
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        placeholder="e.g. Agriculture"
                        value={category}
                        onChange={(e)=>setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Faculty</label>
                    <input
                        type="text"
                        placeholder="e.g. Science & Technology"
                        value={faculty}
                        onChange={(e)=>setFaculty(e.target.value)}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Core Technology</label>
                <input
                    type="text"
                    placeholder="e.g. React, Python"
                    value={technology}
                    onChange={(e)=>setTechnology(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>GitHub Repository Link</label>
                <input
                    type="url"
                    placeholder="https://github.com/yourusername/project"
                    onChange={(e)=>setGithub(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Project Document (PDF)</label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e)=>setFile(e.target.files[0])}
                    required
                />
            </div>

            <button type="submit" className="btn-gradient" style={{ marginTop: '1rem' }}>Submit for Approval</button>
        </form>
    </div>
)

}

export default SubmitProject