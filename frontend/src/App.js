import React, { useState } from "react";
import "./App.css";

function App() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:5000/signin"
        : "http://localhost:5000/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setMessage(data.message);

      // Clear form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });

    } catch (error) {
      console.log(error);
      setMessage("Server not responding ❌");
    }
  };

  return (
    <div className="container">

      <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit}>

        {!isLogin && (
          <>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </>
        )}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>

      </form>

      <p style={{ color: "green" }}>{message}</p>

      <button onClick={() => {
        setIsLogin(!isLogin);
        setMessage("");
      }}>
        {isLogin ? "Create Account" : "Already have account?"}
      </button>

    </div>
  );
}

export default App;