import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    district: "",
    userRole: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/register", values)
      .then((response) => {
        if (response.data.Status === "Success") {
          navigate("/login");
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container mt-3">
      <div className="row align-items-center">
        <div className="col-md-6">
          <img src="/login-bkg.jpg" alt="Filler" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <div className="col">
            <h2 className="text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      name="firstName"
                      onChange={(e) =>
                        setValues({ ...values, firstName: e.target.value })
                      }
                      className="form-control"
                      id="firstName"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      name="lastName"
                      onChange={(e) =>
                        setValues({ ...values, lastName: e.target.value })
                      }
                      className="form-control"
                      id="lastName"
                    />
                  </div>
                </div>
              </div>
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
              <div className="mb-3">
                <label htmlFor="district" className="form-label">
                  District
                </label>
                <select
                  className="form-control"
                  id="district"
                  onChange={(e) =>
                    setValues({ ...values, district: e.target.value })
                  }
                >
                  <option value="Ampara">Ampara</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Batticaloa">Batticaloa</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Galle">Galle</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Hambantota">Hambantota</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Kegalle">Kegalle</option>
                  <option value="Kilinochchi">Kilinochchi</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Mannar">Mannar</option>
                  <option value="Matale">Matale</option>
                  <option value="Matara">Matara</option>
                  <option value="Monaragala">Monaragala</option>
                  <option value="Mullaitivu">Mullaitivu</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Polonnaruwa">Polonnaruwa</option>
                  <option value="Puttalam">Puttalam</option>
                  <option value="Ratnapura">Ratnapura</option>
                  <option value="Trincomalee">Trincomalee</option>
                  <option value="Vavuniya">Vavuniya</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Select your role:</label>
                <div className="row">
                  <div className="col text-center">
                    <img
                      src="/freelancer-icon.jpg"
                      alt="Freelancer"
                      width="100"
                      className="mb-2"
                    />
                    <br />
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="userRole"
                        id="freelancer"
                        value="freelancer"
                        onChange={(e) =>
                          setValues({ ...values, userRole: e.target.value })
                        }
                      />
                      <label className="form-check-label" htmlFor="freelancer">
                        Freelancer
                      </label>
                    </div>
                  </div>

                  <div className="col text-center">
                    <img
                      src="/employer-icon.jpg"
                      alt="Employer"
                      width="100"
                      className="mb-2"
                    />
                    <br />
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="userRole"
                        id="employer"
                        value="employer"
                        onChange={(e) =>
                          setValues({ ...values, userRole: e.target.value })
                        }
                      />
                      <label className="form-check-label" htmlFor="employer">
                        Employer
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>

              <div className="text-center mt-3">
                Already have an account?&nbsp;
                <a
                  href="/login"
                  className="link-primary"
                  style={{ textDecoration: "none" }}
                >
                  Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
