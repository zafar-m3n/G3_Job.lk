import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/login", values)
      .then((response) => {
        if (response.data.Status === "Success") {
          navigate(
            response.data.userRole === "freelancer"
              ? "/freelancer-dashboard"
              : "/employer-dashboard"
          );
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container mt-3">
      <div className="row align-items-center">
        <div className="col-md-7">
          <img src="/login-bkg.jpg" alt="Filler" className="img-fluid" />
        </div>
        <div className="col-md-4">
          <div className="col">
            <h2 className="text-center">Log In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                  className="form-control"
                  id="email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  className="form-control"
                  id="password"
                />
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
              </div>

              <div className="text-center mt-3">
                Don't have an account?&nbsp;
                <a
                  href="/register"
                  className="link-primary"
                  style={{ textDecoration: "none" }}
                >
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
