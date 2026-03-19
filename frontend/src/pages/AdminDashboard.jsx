import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"
import API from "../services/api"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function AdminDashboard() {
  const [facultyData, setFacultyData] = useState([])
  const [techData, setTechData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const [facultyRes, techRes, statusRes, studentsRes] = await Promise.all([
          API.get("/admin/projects-per-faculty", { headers }),
          API.get("/admin/trending-tech", { headers }),
          API.get("/admin/status-stats", { headers }),
          API.get("/admin/top-students", { headers })
        ])

        setFacultyData(facultyRes.data)
        setTechData(techRes.data)
        setStatusData(statusRes.data)
        setTopStudents(studentsRes.data || [])
      } catch (error) {
        console.error("Failed to fetch analytics data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="loading-state">Loading Analytics Dashboard...</div>
  }

  // Prep data for Doughnut chart (Projects per Faculty)
  const facultyChartData = {
    labels: facultyData.map(d => d.faculty || "Unknown"),
    datasets: [
      {
        data: facultyData.map(d => d.total_projects ?? d.count ?? 0),
        backgroundColor: [
          "#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"
        ],
        borderWidth: 1,
      },
    ],
  }

  // Prep data for Bar chart (Trending Tech)
  const techChartData = {
    labels: techData.map(d => d.technology || "None"),
    datasets: [
      {
        label: "Projects using this tech",
        data: techData.map(d => d.usage_count ?? d.count ?? 0),
        backgroundColor: "#4f46e5",
      },
    ],
  }

  // Calculate quick stats cards (API returns 'total' for status stats)
  const totalProjects = statusData.reduce((acc, curr) => acc + (curr.total ?? curr.count ?? 0), 0)
  const approvedProjects = statusData.find(s => s.status === 'approved')?.total ?? statusData.find(s => s.status === 'approved')?.count ?? 0
  const pendingProjects = statusData.find(s => s.status === 'pending')?.total ?? statusData.find(s => s.status === 'pending')?.count ?? 0
  
  const approvalRate = totalProjects === 0 
    ? 0 
    : Math.round((approvedProjects / totalProjects) * 100)

  return (
    <div className="admin-dashboard-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="gallery-title" style={{ marginBottom: "2rem" }}>Admin Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "1.5rem",
        marginBottom: "3rem" 
      }}>
        <div className="kpi-card" style={{ borderLeft: "4px solid #4f46e5" }}>
          <h3 style={{ color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Total Projects</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#0f172a" }}>{totalProjects}</p>
        </div>
        
        <div className="kpi-card" style={{ borderLeft: "4px solid #10b981" }}>
          <h3 style={{ color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Approved</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#0f172a" }}>{approvedProjects}</p>
        </div>

        <div className="kpi-card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <h3 style={{ color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Pending Review</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#0f172a" }}>{pendingProjects}</p>
        </div>

        <div className="kpi-card" style={{ borderLeft: "4px solid #ec4899" }}>
          <h3 style={{ color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Approval Rate</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#0f172a" }}>{approvalRate}%</p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="charts-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "2rem" 
      }}>
        {/* Doughnut Chart */}
        <div className="chart-container">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#334155" }}>Projects by Faculty</h2>
          <div style={{ height: "300px", display: "flex", justifyContent: "center" }}>
            <Doughnut data={facultyChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#334155" }}>Trending Technologies</h2>
          <div style={{ height: "300px" }}>
            <Bar 
              data={techChartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
              }} 
            />
          </div>
        </div>

        {/* Most Active Innovators */}
        <div className="chart-container" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#334155" }}>Most Active Innovators</h2>
          {topStudents.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {topStudents.map((s, i) => (
                <li key={i} style={{ padding: "0.75rem 0", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{s.name || "Unknown"}</span>
                  <span className="badge">{s.total_projects ?? s.count ?? 0} projects</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#64748b" }}>No project submissions yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
