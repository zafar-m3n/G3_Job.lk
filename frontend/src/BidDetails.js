import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/BidDetailsStyle.css";

function BidDetails() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
    location: "",
    role: "",
  });
  const getUserData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getUserData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      const userData = {
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: `../${res.data.user.profile_image}`,
        email: res.data.user.email,
        location: res.data.user.district,
        role: res.data.user.user_role,
      };
      console.log("User Data:" + JSON.stringify(res.data.user, null, 2));
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [bids, setBids] = useState({
    bidId: bidId,
    bidAmount: "",
    deadline: "",
    deliverables: "",
    additionalInfo: "",
    phoneNumber: "",
    freelancerId: "",
    freelancerName: "",
    freelancerPfp: "",
    jobId: "",
    status: "",
  });

  const getSingleBidData = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/getBidData/${bidId}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Bid Data:" + JSON.stringify(res.data.Bids, null, 2));
      const bidData = {
        bidId: res.data.Bids.bidId,
        bidAmount: res.data.Bids.bidAmount,
        deadline: res.data.Bids.deadline,
        deliverables: res.data.Bids.deliverables,
        additionalInfo: res.data.Bids.additionalInfo,
        phoneNumber: res.data.Bids.phoneNumber,
        freelancerId: res.data.Bids.freelancerId,
        freelancerName: res.data.Bids.freelancerName,
        freelancerPfp: res.data.Bids.profile_image,
        jobId: res.data.Bids.jobId,
        status: res.data.Bids.status,
      };
      setBids(bidData);
    } catch (error) {
      console.log(error);
    }
  };

  const [successMessage, setSuccessMessage] = useState("");
  const acceptBid = async () => {
    console.log("Accept Bid clicked");
    try {
      const res = await axios.post(
        "http://localhost:8081/acceptBid",
        {
          bidId: bidId,
          jobId: bids.jobId,
          freelancerName: bids.freelancerName,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log(res);
      setSuccessMessage(`${res.data.Message}`);
      setBids({ ...bids, status: "awarded" });

      setTimeout(() => {
        setSuccessMessage("");
        navigate(`/job-details-employer/${bids.jobId}`);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const declineBid = async () => {
    console.log("Decline Bid clicked");
    try {
      const res = await axios.post(
        "http://localhost:8081/declineBid",
        {
          bidId: bidId,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log(res);
      setSuccessMessage(`${res.data.Message}`);
      setBids({ ...bids, status: "declined" });

      setTimeout(() => {
        setSuccessMessage("");
        navigate(`/job-details-employer/${bids.jobId}`);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    getSingleBidData();
  }, []);

  return (
    <>
      <Header userData={userData} />
      <div className="container">
        <div className="row">
          <div className="col-md-8 d-flex p-2">
            <h3 className="title m-0">Bid Details</h3>
          </div>
          {bids.status === "pending" ? (
            <div className="col-md-4 d-flex justify-content-end align-items-end p-2">
              <button className="btn btn-success mx-2" onClick={acceptBid}>
                Accept Bid
              </button>
              <button className="btn btn-danger mx-2" onClick={declineBid}>
                Decline Bid
              </button>
            </div>
          ) : (
            <div className="col-md-4 d-flex justify-content-end align-items-end p-2">
              <p
                className={`card-text text-capitalize fw-bold ${
                  bids.status === "awarded" ? "text-success" : "text-danger"
                }`}
              >
                {bids.status}
              </p>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <hr />
        </div>
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-2">
                    <img
                      src={`/${bids.freelancerPfp}`}
                      alt="profile"
                      className="img-fluid rounded-circle"
                    />
                  </div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-6">
                        <h5 className="card-title">{bids.freelancerName}</h5>
                      </div>
                      <div className="col-md-6">
                        <h5 className="card-title text-right">
                          Bid Amount: Rs. {bids.bidAmount}
                        </h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="card-subtitle mb-2 text-muted">
                          Deadline: {bids.deadline}
                        </h6>
                      </div>
                      <div className="col-md-6">
                        <h6 className="card-subtitle mb-2 text-muted text-right">
                          Phone Number: {bids.phoneNumber}
                        </h6>
                      </div>
                    </div>
                    <p className="card-text">{bids.additionalInfo}</p>
                    <p className="card-text">{bids.deliverables}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BidDetails;
