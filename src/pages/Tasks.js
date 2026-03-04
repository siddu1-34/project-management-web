import React,{useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import API from "../services/api";

function Tasks(){

const {projectId} = useParams();

const [tasks,setTasks] = useState([]);

const [form,setForm] = useState({
title:"",
description:"",
priority:"medium",
status:"todo",
dueDate:""
});

const [statusFilter,setStatusFilter] = useState("");
const [page,setPage] = useState(1);

const [loading,setLoading] = useState(false);

useEffect(()=>{
fetchTasks();
},[page,statusFilter]);

// FETCH TASKS

const fetchTasks = async()=>{

try{

setLoading(true);

const res = await API.get(
`/api/tasks/${projectId}?page=${page}&limit=5&status=${statusFilter}`
);

setTasks(res.data);

}catch(error){

alert("Failed to load tasks");

}finally{
setLoading(false);
}

};


// INPUT CHANGE

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};


// CREATE TASK

const createTask = async(e)=>{

e.preventDefault();

if(!form.title || !form.description || !form.dueDate){
alert("Please fill all required fields");
return;
}

try{

await API.post(`/api/tasks/${projectId}`,form);

alert("Task Created");

setForm({
title:"",
description:"",
priority:"medium",
status:"todo",
dueDate:""
});

fetchTasks();

}catch(error){

alert(error.response?.data?.message || "Failed to create task");

}

};


// DELETE TASK

const deleteTask = async(id)=>{

try{

await API.delete(`/api/tasks/${id}`);

alert("Task Deleted");

fetchTasks();

}catch(error){

alert("Failed to delete task");

}

};


// UPDATE STATUS

const changeStatus = async(id,status)=>{

try{

await API.put(`/api/tasks/${id}`,{
status
});

fetchTasks();

}catch(error){

alert("Failed to update task");

}

};


return(

<div className="container mt-4">

<h2 className="mb-3">Project Tasks</h2>


{/* CREATE TASK FORM */}

<div className="card p-3 mb-4">

<h5>Create Task</h5>

<form onSubmit={createTask}>

<div className="row">

<div className="col-md-3">

<input
className="form-control"
name="title"
placeholder="Task Title *"
value={form.title}
onChange={handleChange}
/>

</div>


<div className="col-md-3">

<input
className="form-control"
name="description"
placeholder="Description *"
value={form.description}
onChange={handleChange}
/>

</div>


<div className="col-md-2">

<select
className="form-control"
name="priority"
value={form.priority}
onChange={handleChange}
>

<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>

</select>

</div>


<div className="col-md-2">

<select
className="form-control"
name="status"
value={form.status}
onChange={handleChange}
>

<option value="todo">Todo</option>
<option value="in-progress">In Progress</option>
<option value="completed">Completed</option>

</select>

</div>


<div className="col-md-2">

<input
type="date"
className="form-control"
name="dueDate"
value={form.dueDate}
onChange={handleChange}
/>

</div>

</div>

<button className="btn btn-success mt-3">
Add Task
</button>

</form>

</div>


{/* FILTER */}

<div className="mb-3">

<select
className="form-control"
onChange={(e)=>setStatusFilter(e.target.value)}
>

<option value="">All Tasks</option>
<option value="todo">Todo</option>
<option value="in-progress">In Progress</option>
<option value="completed">Completed</option>

</select>

</div>


{/* TASK LIST */}

{loading ? (

<h5>Loading Tasks...</h5>

) : (

<div className="row">

{tasks.map(task=>(

<div className="col-md-4" key={task._id}>

<div className="card shadow p-3 mb-3">

<h5>{task.title}</h5>

<p>{task.description}</p>

<p>
<strong>Priority:</strong> {task.priority}
</p>

<p>
<strong>Status:</strong> {task.status}
</p>

<p>
<strong>Due:</strong>{" "}
{task.dueDate
? new Date(task.dueDate).toLocaleDateString()
: "N/A"}
</p>

<select
className="form-control mb-2"
value={task.status}
onChange={(e)=>changeStatus(task._id,e.target.value)}
>

<option value="todo">Todo</option>
<option value="in-progress">In Progress</option>
<option value="completed">Completed</option>

</select>

<button
className="btn btn-danger"
onClick={()=>deleteTask(task._id)}
>
Delete Task
</button>

</div>

</div>

))}

</div>

)}


{/* PAGINATION */}

<div className="mt-3">

<button
className="btn btn-secondary me-2"
onClick={()=>setPage(page-1)}
disabled={page===1}
>
Previous
</button>

<button
className="btn btn-secondary"
onClick={()=>setPage(page+1)}
>
Next
</button>

</div>

</div>

);

}

export default Tasks;