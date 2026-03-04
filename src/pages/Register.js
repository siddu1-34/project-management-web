import React,{useState} from "react";
import API from "../services/api";
import {useNavigate,Link} from "react-router-dom";

function Register(){

const navigate = useNavigate();

const [form,setForm] = useState({
name:"",
email:"",
password:""
});

const [error,setError] = useState("");
const [loading,setLoading] = useState(false);


// HANDLE INPUT CHANGE

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};


// VALIDATION FUNCTION

const validateForm = ()=>{

if(!form.name || !form.email || !form.password){
setError("All fields are required");
return false;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(form.email)){
setError("Invalid email format");
return false;
}

if(form.password.length < 6){
setError("Password must be at least 6 characters");
return false;
}

return true;

};


// REGISTER USER

const handleSubmit = async(e)=>{

e.preventDefault();

setError("");

if(!validateForm()) return;

try{

setLoading(true);

await API.post("/api/auth/register",form);

alert("Registration successful");

navigate("/");

}catch(err){

setError(
err.response?.data?.message || "Registration failed"
);

}finally{

setLoading(false);

}

};


return(

<div className="container d-flex justify-content-center align-items-center vh-100">

<div className="card shadow p-4" style={{width:"420px"}}>

<h3 className="text-center mb-4">Create Account</h3>


{/* ERROR MESSAGE */}

{error && (

<div className="alert alert-danger">
{error}
</div>

)}


<form onSubmit={handleSubmit}>


{/* NAME */}

<input
className="form-control mb-3"
placeholder="Full Name"
name="name"
value={form.name}
onChange={handleChange}
/>


{/* EMAIL */}

<input
className="form-control mb-3"
placeholder="Email"
name="email"
value={form.email}
onChange={handleChange}
/>


{/* PASSWORD */}

<input
className="form-control mb-3"
type="password"
placeholder="Password"
name="password"
value={form.password}
onChange={handleChange}
/>


{/* REGISTER BUTTON */}

<button
className="btn btn-success w-100"
disabled={loading}
>

{loading ? "Registering..." : "Register"}

</button>

</form>


{/* LOGIN LINK */}

<div className="text-center mt-3">

<p>Already have an account?</p>

<Link to="/" className="btn btn-outline-primary w-100">
Login
</Link>

</div>

</div>

</div>

);

}

export default Register;