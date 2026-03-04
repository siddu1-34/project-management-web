import React,{useState} from "react";
import API from "../services/api";
import {useNavigate,Link} from "react-router-dom";

function Login(){

const navigate = useNavigate();

const [form,setForm]=useState({
email:"",
password:""
});

const [loading,setLoading]=useState(false);
const [error,setError]=useState("");

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};


// VALIDATION

const validateForm=()=>{

if(!form.email || !form.password){
setError("Email and Password are required");
return false;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(form.email)){
setError("Invalid email format");
return false;
}

return true;

};


const submit=async(e)=>{

e.preventDefault();

setError("");

if(!validateForm()) return;

try{

setLoading(true);

const res = await API.post("/api/auth/login",form);

localStorage.setItem("token",res.data.token);

navigate("/dashboard");

}catch(err){

setError(
err.response?.data?.message || "Invalid email or password"
);

}finally{
setLoading(false);
}

};


return(

<div className="container d-flex justify-content-center align-items-center vh-100">

<div className="card shadow p-4" style={{width:"400px"}}>

<h3 className="text-center mb-4">Login</h3>

{error && (
<div className="alert alert-danger">
{error}
</div>
)}

<form onSubmit={submit}>

<input
className="form-control mb-3"
placeholder="Email"
name="email"
value={form.email}
onChange={handleChange}
/>

<input
className="form-control mb-3"
type="password"
placeholder="Password"
name="password"
value={form.password}
onChange={handleChange}
/>

<button
className="btn btn-primary w-100"
disabled={loading}
>

{loading ? "Logging in..." : "Login"}

</button>

</form>


<div className="text-center mt-3">

<p>
Don't have an account?
</p>

<Link to="/register" className="btn btn-outline-success w-100">
Create Account
</Link>

</div>

</div>

</div>

);

}

export default Login;