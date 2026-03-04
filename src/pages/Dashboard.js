import React,{useState,useEffect} from "react";
import API from "../services/api";
import {Link,useNavigate} from "react-router-dom";

function Dashboard(){

const navigate = useNavigate();

const [projects,setProjects] = useState([]);

const [form,setForm] = useState({
projectName:"",
description:""
});

const [loading,setLoading] = useState(false);

const [page,setPage] = useState(1);
const limit = 6;

useEffect(()=>{
fetchProjects();
},[page]);


// FETCH PROJECTS

const fetchProjects = async()=>{

try{

setLoading(true);

const res = await API.get(`/api/projects?page=${page}&limit=${limit}`);

setProjects(res.data);

}catch(error){

alert("Failed to load projects");

}finally{

setLoading(false);

}

};


// INPUT CHANGE

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};


// CREATE PROJECT

const createProject = async(e)=>{

e.preventDefault();

if(!form.projectName || !form.description){
alert("Project name and description are required");
return;
}

try{

await API.post("/api/projects",form);

setForm({
projectName:"",
description:""
});

fetchProjects();

}catch(error){

alert(error.response?.data?.message || "Project creation failed");

}

};


// DELETE PROJECT

const deleteProject = async(id)=>{

if(!window.confirm("Delete this project?")) return;

try{

await API.delete(`/api/projects/${id}`);

fetchProjects();

}catch(error){

alert("Failed to delete project");

}

};


// LOGOUT FUNCTION

const logout = ()=>{

localStorage.removeItem("token");

navigate("/");

};


return(

<div className="container mt-4">

{/* HEADER */}

<div className="d-flex justify-content-between align-items-center mb-4">

<h2>📁 Project Dashboard</h2>

<div>

<span className="badge bg-primary me-3">
Total Projects: {projects.length}
</span>

<button
className="btn btn-outline-dark"
onClick={logout}
>
Logout
</button>

</div>

</div>


{/* CREATE PROJECT */}

<div className="card shadow-sm p-4 mb-4">

<h5 className="mb-3">➕ Create New Project</h5>

<form onSubmit={createProject}>

<div className="row g-2">

<div className="col-md-5">

<input
className="form-control"
name="projectName"
placeholder="Project Name *"
value={form.projectName}
onChange={handleChange}
/>

</div>

<div className="col-md-5">

<input
className="form-control"
name="description"
placeholder="Project Description *"
value={form.description}
onChange={handleChange}
/>

</div>

<div className="col-md-2">

<button className="btn btn-success w-100">
Create
</button>

</div>

</div>

</form>

</div>


{/* PROJECT LIST */}

{loading ? (

<div className="text-center">

<div className="spinner-border text-primary"/>

</div>

) : projects.length === 0 ? (

<div className="alert alert-info text-center">

No projects found. Create your first project.

</div>

) : (

<div className="row">

{projects.map((p)=>(

<div className="col-md-4 mb-4" key={p._id}>

<div className="card shadow border-0 h-100">

<div className="card-body">

<h5 className="text-primary">
📌 {p.projectName}
</h5>

<p className="text-muted">
{p.description}
</p>

<p className="small text-secondary">
Created: {p.createdAt
? new Date(p.createdAt).toLocaleDateString()
: "N/A"}
</p>

<Link
className="btn btn-outline-primary w-100 mb-2"
to={`/tasks/${p._id}`}
>
Manage Tasks
</Link>

<button
className="btn btn-outline-danger w-100"
onClick={()=>deleteProject(p._id)}
>
Delete Project
</button>

</div>

</div>

</div>

))}

</div>

)}


{/* PAGINATION */}

<div className="d-flex justify-content-center mt-4">

<button
className="btn btn-secondary me-2"
onClick={()=>setPage(page-1)}
disabled={page===1}
>
⬅ Previous
</button>

<span className="align-self-center">
Page {page}
</span>

<button
className="btn btn-secondary ms-2"
onClick={()=>setPage(page+1)}
>
Next ➡
</button>

</div>

</div>

);

}

export default Dashboard;