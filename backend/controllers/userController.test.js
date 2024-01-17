const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const jobModel = require("../models/jobModel");
const freelancerModel = require("../models/freelancerModel");
const employerModel = require("../models/employerModel");
const bidModel = require("../models/bidModel");
const ratingModel = require("../models/ratingModel");
const resourceModel = require("../models/resourceModel");
const endorsementModel = require("../models/endorsementModel");
const clusterModel = require("../models/clusterModel");
const {
  register,
  login,
  getUserData,
  postJob,
  getJobData,
  getJobDataFreelancer,
  updateUserData,
  uploadProfileImage,
  getFreelancerData,
  getEmployerData,
  updateEmployerDescription,
  updateEmployerLanguages,
  updateEmployerWebsite,
  updateFreelancerDescription,
  updateFreelancerLanguages,
  updateFreelancerSkills,
  updateFreelancerWebsite,
  getSingleJobData,
  getEmployerDataByEmail,
  insertJobBid,
  getJobBids,
  getAllJobBids,
  getSingleBid,
  acceptBid,
  declineBid,
  getFreelancersData,
  getFreelancerDataById,
  submitRating,
  getResources,
  endorseSkills,
  getEmployersData,
  getEmployerDataById,
  getClusters,
  updateResource,
  deleteResource,
  addResource,
  addCluster,
  getClusterDataById,
  getClustersEmployer,
  joinCluster,
  leaveCluster,
  hireCluster,
  getRecommendedJobs,
} = require("./userController");

jest.mock("bcrypt", () => ({
  hash: jest.fn((password, saltRounds, callback) =>
    callback(null, "mocked_hash")
  ),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

jest.mock("../models/userModel", () => ({
  findUserByEmail: jest.fn(),
  insertUser: jest.fn(),
  findOne: jest.fn(),
  updateUser: jest.fn(),
  findFreelancers: jest.fn(),
  findEmployers: jest.fn(),
}));

jest.mock("../models/jobModel", () => ({
  insertJob: jest.fn(),
  getJobById: jest.fn(),
  getJobFromEmployer: jest.fn(),
  getAllJobs: jest.fn(),
  getJobsBySkills: jest.fn(),
}));

jest.mock("../models/freelancerModel", () => ({
  findFreelancerById: jest.fn(),
  updateFreelancerDescription: jest.fn(),
  updateFreelancerLanguages: jest.fn(),
  updateFreelancerSkills: jest.fn(),
  updateFreelancerWebsite: jest.fn(),
  insertFreelancer: jest.fn(),
  findFreelancerByUserId: jest.fn(),
  freelancerModel: jest.fn(),
}));

jest.mock("../models/employerModel", () => ({
  findEmployerById: jest.fn(),
  updateEmployerDescription: jest.fn(),
  updateEmployerLanguages: jest.fn(),
  updateEmployerWebsite: jest.fn(),
  insertEmployer: jest.fn(),
  findEmployerByUserId: jest.fn(),
}));

jest.mock("../models/bidModel", () => ({
  insertJobBid: jest.fn(),
  getJobBids: jest.fn(),
  getAllJobBids: jest.fn(),
  getSingleBid: jest.fn(),
  acceptBid: jest.fn(),
  declineBid: jest.fn(),
}));

jest.mock("../models/ratingModel", () => ({
  insertRating: jest.fn(),
}));

jest.mock("../models/resourceModel", () => ({
  getAllResources: jest.fn(),
  updateResource: jest.fn(),
  deleteResource: jest.fn(),
  addResource: jest.fn(),
}));

jest.mock("../models/endorsementModel", () => ({
  endorseSkills: jest.fn(),
}));

jest.mock("../models/clusterModel", () => ({
  getAllClusters: jest.fn(),
  addCluster: jest.fn(),
  getClusterDataById: jest.fn(),
  getClustersEmployer: jest.fn(),
  joinCluster: jest.fn(),
  leaveCluster: jest.fn(),
  hireCluster: jest.fn(),
}));

describe("Register function in userController", () => {
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    // Clear mock calls before each test
    bcrypt.hash.mockClear();
    jwt.sign.mockClear();
    UserModel.findUserByEmail.mockClear();
    UserModel.insertUser.mockClear();
  });

  it("should successfully register a new user", async () => {
    // Setup mocks for a successful registration
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [])
    );
    UserModel.insertUser.mockImplementationOnce((user, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      district: "District 1",
      userRole: "user",
    });
    const res = mockRes();

    await register(req, res);

    // Assertions
    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "john@example.com",
      expect.any(Function)
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(
      "password123",
      10,
      expect.any(Function)
    );
    expect(UserModel.insertUser).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, "CCG3ZNARCH", {
      expiresIn: "1d",
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Status: "Success",
        user: expect.any(Object),
        token: "mocked_token",
      })
    );
  });

  it("should return an error message when registering a user with an existing email", async () => {
    // Mocking UserModel.findUserByEmail to simulate finding an existing user
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [{ id: 1, email: "john@example.com" }])
    );

    const req = mockReq({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      district: "District 1",
      userRole: "user",
    });
    const res = mockRes();

    await register(req, res);

    // Assertions
    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "john@example.com",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Email is already in use" });
  });

  it("should return an error message when there is a database query error in findUserByEmail", async () => {
    // Mocking UserModel.findUserByEmail to simulate a database query error
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      district: "District 1",
      userRole: "user",
    });
    const res = mockRes();

    await register(req, res);

    // Assertions
    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "john@example.com",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Database query error" + new Error("Database query error"),
    });
  });

  it("should return an error message when there is an error for hashing password", async () => {
    // Mocking bcrypt.hash to simulate an error during hashing
    bcrypt.hash.mockImplementationOnce((password, saltRounds, callback) =>
      callback(new Error("Error for hashing password"), null)
    );

    // Setup as if the user is not found in the database
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [])
    );

    const req = mockReq({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      district: "District 1",
      userRole: "user",
    });
    const res = mockRes();

    await register(req, res);

    // Assertions
    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "john@example.com",
      expect.any(Function)
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(
      "password123",
      10,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error for hashing password",
    });
  });
});

describe("Login function in userController", () => {
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
    UserModel.findUserByEmail.mockClear();
  });

  it("should successfully log in a user", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [
        { id: 1, password: "hashed_password", user_role: "freelancer" },
      ])
    );
    bcrypt.compare.mockImplementationOnce((password, hash, callback) =>
      callback(null, true)
    );
    jwt.sign.mockReturnValue("mocked_token");

    const req = mockReq({
      email: "user@example.com",
      password: "password123",
    });
    const res = mockRes();

    await login(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "user@example.com",
      expect.any(Function)
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed_password",
      expect.any(Function)
    );
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, "CCG3ZNARCH", {
      expiresIn: "1d",
    });
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      userRole: "freelancer",
      token: "mocked_token",
    });
  });

  it("should return an error for invalid email or password", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [])
    );

    const req = mockReq({
      email: "user@example.com",
      password: "password123",
    });
    const res = mockRes();

    await login(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "user@example.com",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Invalid email or password",
    });
  });

  it("should return an error message when there is a database query error", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq({
      email: "user@example.com",
      password: "password123",
    });
    const res = mockRes();

    await login(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "user@example.com",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return an error for a password comparison error", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [
        { id: 1, password: "hashed_password", user_role: "employer" },
      ])
    );
    bcrypt.compare.mockImplementationOnce((password, hash, callback) =>
      callback(new Error("Password comparison error"), null)
    );

    const req = mockReq({
      email: "user@example.com",
      password: "password123",
    });
    const res = mockRes();

    await login(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "user@example.com",
      expect.any(Function)
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed_password",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error for comparing password",
    });
  });
});

describe("getUserData function in userController", () => {
  const mockReq = (user = {}) => ({
    user,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    // Reset mocks before each test
    UserModel.findOne.mockReset();
  });

  it("should successfully retrieve user data", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, name: "John Doe", email: "john@example.com" }])
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getUserData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      user: { id: 1, name: "John Doe", email: "john@example.com" },
    });
  });

  it("should return an error for a database query error", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getUserData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return an error if user is not found", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getUserData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "User not found" });
  });

  it("should handle server errors correctly", async () => {
    UserModel.findOne.mockImplementationOnce(() => {
      throw new Error("Server error");
    });

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getUserData(req, res);

    expect(res.json).toHaveBeenCalledWith({ Error: "Server error" });
  });
});

describe("postJob function in userController", () => {
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jobModel.insertJob.mockReset();
  });

  it("should successfully post a job", async () => {
    jobModel.insertJob.mockImplementationOnce((job, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      jobTitle: "Web Developer",
      jobDescription: "Develop a website",
      requiredSkills: "HTML, CSS, JavaScript",
      estimatedBudget: 1000,
      projectDuration: "1 month",
      experienceLevel: "Intermediate",
      location: "Colombo",
      additionalInfo: "Start immediately",
      employer: "employer@example.com",
    });
    const res = mockRes();

    await postJob(req, res);

    expect(jobModel.insertJob).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      job: expect.objectContaining({
        job_id: 1,
        job_title: "Web Developer",
        job_description: "Develop a website",
        required_skills: "HTML, CSS, JavaScript",
        estimated_budget: 1000,
        project_duration: "1 month",
        experience_level: "Intermediate",
        location: "Colombo",
        additional_info: "Start immediately",
        employer_email: "employer@example.com",
      }),
    });
  });

  it("should return an error for a database insertion error", async () => {
    jobModel.insertJob.mockImplementationOnce((job, callback) =>
      callback(new Error("Database insertion error"), null)
    );

    const req = mockReq({
      jobTitle: "Senior Developer",
      jobDescription: "Development of complex web applications",
      requiredSkills: "JavaScript, React, Node.js",
      estimatedBudget: 5000,
      projectDuration: "6 months",
      experienceLevel: "Expert",
      location: "Remote",
      additionalInfo: "Needs to be proficient in backend technologies",
      employer: "employer@example.com",
    });
    const res = mockRes();

    await postJob(req, res);

    expect(jobModel.insertJob).toHaveBeenCalledWith(
      [
        "Senior Developer",
        "Development of complex web applications",
        "JavaScript, React, Node.js",
        5000,
        "6 months",
        "Expert",
        "Remote",
        "Needs to be proficient in backend technologies",
        "employer@example.com",
      ],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Database insertion error",
    });
  });

  it("should return an error for incomplete job data", async () => {
    const req = mockReq({
      jobTitle: "Web Developer",
      jobDescription: "Develop a website",
    });
    const res = mockRes();

    await postJob(req, res);

    expect(res.json).toHaveBeenCalledWith({ Error: "Incomplete job data" });
  });
});

describe("getJobData function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (user = {}) => ({
    user,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    // Reset mocks before each test
    UserModel.findOne.mockReset();
    jobModel.getJobFromEmployer.mockReset();
  });

  it("should successfully retrieve job data", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, email: "employer@example.com" }])
    );
    jobModel.getJobFromEmployer.mockImplementationOnce((email, callback) =>
      callback(null, [{ job_id: 1, title: "Web Developer" }])
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getJobData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(jobModel.getJobFromEmployer).toHaveBeenCalledWith(
      "employer@example.com",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Jobs: [{ job_id: 1, title: "Web Developer" }],
    });
  });

  it("should return an error for finding user error", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(new Error("Error finding user"), null)
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getJobData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding user" });
  });

  it("should return an error if employer is not found", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getJobData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Employer not found" });
  });

  it("should return an error for finding jobs error", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, email: "employer@example.com" }])
    );
    jobModel.getJobFromEmployer.mockImplementationOnce((email, callback) =>
      callback(new Error("Error finding jobs"), null)
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getJobData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(jobModel.getJobFromEmployer).toHaveBeenCalledWith(
      "employer@example.com",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding jobs" });
  });
});

describe("getJobDataFreelancer function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = () => ({});
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jobModel.getAllJobs.mockReset();
  });

  it("should successfully retrieve all jobs", async () => {
    jobModel.getAllJobs.mockImplementationOnce((callback) =>
      callback(null, [{ jobId: 1, title: "Web Development" }])
    );

    const req = mockReq();
    const res = mockRes();

    await getJobDataFreelancer(req, res);

    expect(jobModel.getAllJobs).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Jobs: [{ jobId: 1, title: "Web Development" }],
    });
  });

  it("should return an error for finding jobs error", async () => {
    jobModel.getAllJobs.mockImplementationOnce((callback) =>
      callback(new Error("Error finding jobs"), null)
    );

    const req = mockReq();
    const res = mockRes();

    await getJobDataFreelancer(req, res);

    expect(jobModel.getAllJobs).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding jobs" });
  });

  it("should handle no jobs available", async () => {
    jobModel.getAllJobs.mockImplementationOnce((callback) =>
      callback(null, [])
    );

    const req = mockReq();
    const res = mockRes();

    await getJobDataFreelancer(req, res);

    expect(jobModel.getAllJobs).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ Status: "Success", Jobs: [] });
  });
});

describe("updateUserData function in userController", () => {
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.updateUser.mockReset();
  });

  it("should successfully update user data", async () => {
    UserModel.updateUser.mockImplementationOnce((user, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      profileImage: "image.jpg",
      location: "Colombo",
      email: "user@example.com",
      name: "John Doe",
      role: "freelancer",
    });
    const res = mockRes();

    await updateUserData(req, res);

    expect(UserModel.updateUser).toHaveBeenCalledWith(
      ["image.jpg", "Colombo", "user@example.com"],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      user: {
        first_name: "John",
        last_name: "Doe",
        email: "user@example.com",
        district: "Colombo",
        user_role: "freelancer",
        profile_image: "image.jpg",
      },
    });
  });

  it("should return an error during user data update", async () => {
    UserModel.updateUser.mockImplementationOnce((user, callback) =>
      callback(new Error("Update error"), null)
    );

    const req = mockReq({
      profileImage: "image.jpg",
      location: "Colombo",
      email: "user@example.com",
      name: "John Doe",
      role: "freelancer",
    });
    const res = mockRes();

    await updateUserData(req, res);

    expect(UserModel.updateUser).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Update error" });
  });

  it("should return an error if data is incomplete", async () => {
    UserModel.updateUser.mockImplementationOnce((user, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      profileImage: "newimage.jpg",
      location: "Kandy",
      // Email is not provided in this update
    });
    const res = mockRes();

    await updateUserData(req, res);

    expect(UserModel.updateUser).toHaveBeenCalledWith(
      ["newimage.jpg", "Kandy", undefined],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Server error",
    });
  });
});

describe("uploadProfileImage function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (file = null) => ({
    file,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should successfully upload an image", async () => {
    const req = mockReq({ filename: "uploaded_image.jpg" });
    const res = mockRes();

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ imageUrl: "uploaded_image.jpg" });
  });

  it("should return an error if no file is uploaded", async () => {
    const req = mockReq();
    const res = mockRes();

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("No file uploaded.");
  });

  it("should handle file upload errors", async () => {
    const req = mockReq();
    req.file = null;
    const res = mockRes();

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("No file uploaded.");
  });
});

describe("getFreelancerData function in userController", () => {
  const mockReq = (user = {}) => ({
    user,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findOne.mockReset();
    freelancerModel.findFreelancerById.mockReset();
  });

  it("should successfully retrieve freelancer data", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, email: "freelancer@example.com" }])
    );
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, { id: 1, name: "John Doe", skills: "Web Development" })
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getFreelancerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      freelancer: { id: 1, name: "John Doe", skills: "Web Development" },
    });
  });

  it("should return an error for finding user error", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(new Error("Error finding user"), null)
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getFreelancerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding user" });
  });

  it("should return an error if freelancer is not found", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getFreelancerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Freelancer not found" });
  });

  it("should handle no profile details found", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, email: "freelancer@example.com" }])
    );
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, null)
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getFreelancerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Message: "No profile details" });
  });
});

describe("getEmployerData function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (user = {}) => ({
    user,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findOne.mockReset();
    employerModel.findEmployerById.mockReset();
  });

  it("should successfully retrieve employer data", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, email: "employer@example.com" }])
    );
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, { id: 1, name: "John Doe", company: "ABC Corp" })
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getEmployerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      employer: { id: 1, name: "John Doe", company: "ABC Corp" },
    });
  });

  it("should return an error for finding user error", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(new Error("Error finding user"), null)
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getEmployerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding user" });
  });

  it("should return an error if employer is not found", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );

    const req = mockReq({ id: 1 });
    const res = mockRes();
    await getEmployerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Employer not found" });
  });

  it("should handle no profile details found", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, email: "employer@example.com" }])
    );
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, null)
    );
    const req = mockReq({ id: 1 });
    const res = mockRes();

    await getEmployerData(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith(1, expect.any(Function));
    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Message: "No profile details" });
  });
});

describe("updateEmployerDescription function in userController", () => {
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    employerModel.findEmployerById.mockReset();
    employerModel.updateEmployerDescription.mockReset();
    employerModel.insertEmployer.mockReset();
  });

  it("should successfully update employer description", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    employerModel.updateEmployerDescription.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      description: "Experienced Employer",
      languages: "English",
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerDescription(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(employerModel.updateEmployerDescription).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Employer updated",
    });
  });

  it("should return an error in database operation while finding employer", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      description: "Experienced Employer",
      languages: "English",
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerDescription(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new employer when not found", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    employerModel.insertEmployer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      profileID: 2,
      userID: 2,
      description: "New Employer",
      languages: "English",
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerDescription(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(employerModel.insertEmployer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New employer created",
    });
  });

  it("should return an error updating employer description", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    employerModel.updateEmployerDescription.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating employer"), null)
    );

    const req = mockReq({
      userID: 1,
      description: "Experienced Employer",
      languages: "English",
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerDescription(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(employerModel.updateEmployerDescription).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Error updating employer" });
  });
});

describe("updateEmployerLanguages function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    employerModel.findEmployerById.mockReset();
    employerModel.updateEmployerLanguages.mockReset();
    employerModel.insertEmployer.mockReset();
  });

  it("should successfully update employer languages", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    employerModel.updateEmployerLanguages.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      description: "Experienced Employer",
      languages: ["English", "Sinhala"],
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerLanguages(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(employerModel.updateEmployerLanguages).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Employer updated",
    });
  });

  it("should return an error in database operation while finding employer", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      description: "Experienced Employer",
      languages: ["English", "Sinhala"],
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerLanguages(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new employer when not found", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    employerModel.insertEmployer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      profileID: 2,
      userID: 2,
      description: "New Employer",
      languages: ["Sinhala", "Tamil"],
      website: "https://newemployer.com",
    });
    const res = mockRes();

    await updateEmployerLanguages(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(employerModel.insertEmployer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New employer created",
    });
  });

  it("should return an error updating employer languages", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    employerModel.updateEmployerLanguages.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating employer"), null)
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      description: "Experienced Employer",
      languages: ["English", "Sinhala"],
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerLanguages(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(employerModel.updateEmployerLanguages).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Error updating employer" });
  });
});

describe("updateEmployerWebsite function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    employerModel.findEmployerById.mockReset();
    employerModel.updateEmployerWebsite.mockReset();
    employerModel.insertEmployer.mockReset();
  });

  it("should successfully update employer website", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    employerModel.updateEmployerWebsite.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerWebsite(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(employerModel.updateEmployerWebsite).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Employer updated",
    });
  });

  it("should return an error in database operation while finding employer", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerWebsite(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new employer when not found", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    employerModel.insertEmployer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      profileID: 2,
      userID: 2,
      website: "https://newemployer.com",
    });
    const res = mockRes();

    await updateEmployerWebsite(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(employerModel.insertEmployer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New employer created",
    });
  });

  it("should return an error updating employer website", async () => {
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    employerModel.updateEmployerWebsite.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating employer"), null)
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      website: "https://example.com",
    });
    const res = mockRes();

    await updateEmployerWebsite(req, res);

    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(employerModel.updateEmployerWebsite).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Error updating employer" });
  });
});

describe("updateFreelancerDescription function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    freelancerModel.findFreelancerById.mockReset();
    freelancerModel.updateFreelancerDescription.mockReset();
    freelancerModel.insertFreelancer.mockReset();
  });

  it("should successfully update freelancer description", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerDescription.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      description: "Experienced Freelancer",
      languages: "English, Sinhala",
      portfolioWebsite: "https://portfolio.example.com",
      skills: "Web Development, Design",
    });
    const res = mockRes();

    await updateFreelancerDescription(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerDescription).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Freelancer updated",
    });
  });

  it("should return an error in database operation while finding freelancer", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      profileID: 1,
      userID: 1,
      //   description: "Experienced Freelancer",
      languages: "English, Sinhala",
      portfolioWebsite: "https://portfolio.example.com",
      skills: "Web Development, Design",
    });
    const res = mockRes();

    await updateFreelancerDescription(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new freelancer when not found", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    freelancerModel.insertFreelancer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      profileID: 2,
      userID: 2,
      description: "New Freelancer",
      languages: "Sinhala, Tamil",
      portfolioWebsite: "https://newfreelancer.com",
      skills: "Graphic Design, Photography",
    });
    const res = mockRes();

    await updateFreelancerDescription(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(freelancerModel.insertFreelancer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New freelancer profile created",
    });
  });

  it("should return an error updating freelancer description", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerDescription.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating freelancer"), null)
    );

    const req = mockReq({
      userID: 1,
    });
    const res = mockRes();

    await updateFreelancerDescription(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerDescription).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error updating freelancer",
    });
  });
});

describe("updateFreelancerLanguages function in userController", () => {
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    freelancerModel.findFreelancerById.mockReset();
    freelancerModel.updateFreelancerLanguages.mockReset();
    freelancerModel.insertFreelancer.mockReset();
  });

  it("should successfully update freelancer languages", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerLanguages.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      userID: 1,
      languages: ["English", "Sinhala"],
    });
    const res = mockRes();

    await updateFreelancerLanguages(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerLanguages).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Freelancer updated",
    });
  });

  it("should return an error in database operation while finding freelancer", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      userID: 1,
      //   languages: ["English", "Sinhala"],
    });
    const res = mockRes();

    await updateFreelancerLanguages(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new freelancer when not found", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    freelancerModel.insertFreelancer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      userID: 2,
      languages: ["Sinhala", "Tamil"],
    });
    const res = mockRes();

    await updateFreelancerLanguages(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(freelancerModel.insertFreelancer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New freelancer profile created",
    });
  });

  it("should return an error updating freelancer languages", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerLanguages.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating freelancer"), null)
    );

    const req = mockReq({
      userID: 1,
      languages: ["English", "Sinhala"],
    });
    const res = mockRes();

    await updateFreelancerLanguages(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerLanguages).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error updating freelancer",
    });
  });
});

describe("updateFreelancerSkills function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    freelancerModel.findFreelancerById.mockReset();
    freelancerModel.updateFreelancerSkills.mockReset();
    freelancerModel.insertFreelancer.mockReset();
  });

  it("should successfully update freelancer skills", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerSkills.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      userID: 1,
      skills: ["Web Development", "Graphic Design"],
    });
    const res = mockRes();

    await updateFreelancerSkills(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerSkills).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Freelancer updated",
    });
  });

  it("should return an error in database operation while finding freelancer", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      userID: 1,
      // skills: ["Web Development", "Graphic Design"],
    });
    const res = mockRes();

    await updateFreelancerSkills(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new freelancer when not found", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    freelancerModel.insertFreelancer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      userID: 2,
      skills: ["MERN Stack", "Node.js"],
    });
    const res = mockRes();

    await updateFreelancerSkills(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(freelancerModel.insertFreelancer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New freelancer profile created",
    });
  });

  it("should return an error updating freelancer skills", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerSkills.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating freelancer"), null)
    );

    const req = mockReq({
      userID: 1,
      skills: ["Web Development", "Graphic Design"],
    });
    const res = mockRes();

    await updateFreelancerSkills(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerSkills).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error updating freelancer",
    });
  });
});

describe("updateFreelancerWebsite function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    freelancerModel.findFreelancerById.mockReset();
    freelancerModel.updateFreelancerWebsite.mockReset();
    freelancerModel.insertFreelancer.mockReset();
  });

  it("should successfully update freelancer website", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerWebsite.mockImplementationOnce(
      (data, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      userID: 1,
      portfolioWebsite: "https://portfolio.example.com",
    });
    const res = mockRes();

    await updateFreelancerWebsite(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerWebsite).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Freelancer updated",
    });
  });

  it("should return an error in database operation while finding freelancer", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Error in database operation"), null)
    );

    const req = mockReq({
      userID: 1,
      //   portfolioWebsite: "https://portfolio.example.com",
    });
    const res = mockRes();

    await updateFreelancerWebsite(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error in database operation",
    });
  });

  it("should insert new freelancer when not found", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );
    freelancerModel.insertFreelancer.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      userID: 2,
      portfolioWebsite: "https://newfreelancer.com",
    });
    const res = mockRes();

    await updateFreelancerWebsite(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      2,
      expect.any(Function)
    );
    expect(freelancerModel.insertFreelancer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "New freelancer profile created",
    });
  });

  it("should return an error updating freelancer website", async () => {
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1 }])
    );
    freelancerModel.updateFreelancerWebsite.mockImplementationOnce(
      (data, callback) => callback(new Error("Error updating freelancer"), null)
    );

    const req = mockReq({
      userID: 1,
      portfolioWebsite: "https://portfolio.example.com",
    });
    const res = mockRes();

    await updateFreelancerWebsite(req, res);

    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      1,
      expect.any(Function)
    );
    expect(freelancerModel.updateFreelancerWebsite).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Error updating freelancer",
    });
  });
});

describe("getSingleJobData function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jobModel.getJobById.mockReset();
  });

  it("should successfully retrieve job data", async () => {
    jobModel.getJobById.mockImplementationOnce((jobId, callback) =>
      callback(null, [
        {
          id: jobId,
          title: "Web Developer",
          description: "Job description here",
        },
      ])
    );

    const req = mockReq({ jobId: "123" });
    const res = mockRes();

    await getSingleJobData(req, res);

    expect(jobModel.getJobById).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Jobs: {
        id: "123",
        title: "Web Developer",
        description: "Job description here",
      },
    });
  });

  it("should return an error finding job in database", async () => {
    jobModel.getJobById.mockImplementationOnce((jobId, callback) =>
      callback(new Error("Error finding jobs"), null)
    );

    const req = mockReq({ jobId: "123" });
    const res = mockRes();

    await getSingleJobData(req, res);

    expect(jobModel.getJobById).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding jobs" });
  });
});

describe("getEmployerDataByEmail function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findUserByEmail.mockReset();
  });

  it("should successfully retrieve employer data by email", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [{ id: 1, email: email, name: "John Doe" }])
    );

    const req = mockReq({ email: "employer@example.com" });
    const res = mockRes();

    await getEmployerDataByEmail(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "employer@example.com",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Employer: [{ id: 1, email: "employer@example.com", name: "John Doe" }],
    });
  });

  it("should return a message when employer not found", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [])
    );

    const req = mockReq({ email: "nonexistent@example.com" });
    const res = mockRes();

    await getEmployerDataByEmail(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "nonexistent@example.com",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ Message: "Employer not found" });
  });

  it("should return an error finding employer in database", async () => {
    UserModel.findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(new Error("Error finding employer"), null)
    );

    const req = mockReq({ email: "employer@example.com" });
    const res = mockRes();

    await getEmployerDataByEmail(req, res);

    expect(UserModel.findUserByEmail).toHaveBeenCalledWith(
      "employer@example.com",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding employer" });
  });
});

describe("insertJobBid function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bidModel.insertJobBid.mockReset();
  });

  it("should successfully insert a job bid", async () => {
    bidModel.insertJobBid.mockImplementationOnce((bid, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      bidAmount: 100,
      deadline: "2023-10-01",
      deliverables: "Website Development",
      additionalInfo: "Need it urgently",
      phoneNumber: "1234567890",
      freelancerName: "John Doe",
      freelancerEmail: "john@example.com",
      freelancerId: 2,
      employerName: "ACME Corp",
      employerEmail: "employer@example.com",
      employerId: 3,
      jobId: 5,
    });
    const res = mockRes();

    await insertJobBid(req, res);

    expect(bidModel.insertJobBid).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      bid: expect.any(Object),
    });
  });

  it("should return an error during insertion of job bid", async () => {
    bidModel.insertJobBid.mockImplementationOnce((bid, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      bidAmount: 200,
      deadline: "2023-12-01",
      deliverables: "Mobile App",
      additionalInfo: "High priority",
      phoneNumber: "9876543210",
      freelancerName: "Jane Smith",
      freelancerEmail: "jane@example.com",
      freelancerId: 4,
      employerName: "XYZ Inc.",
      employerEmail: "contact@xyz.com",
      employerId: 6,
      jobId: 7,
    });
    const res = mockRes();

    await insertJobBid(req, res);

    expect(bidModel.insertJobBid).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });
});

describe("getJobBids function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bidModel.getJobBids.mockReset();
  });

  it("should successfully retrieve job bids", async () => {
    bidModel.getJobBids.mockImplementationOnce(
      (jobId, freelancerId, callback) =>
        callback(null, [{ bid_id: 1, amount: 100, jobId, freelancerId }])
    );

    const req = mockReq({ jobId: "123", freelancerId: "456" });
    const res = mockRes();

    await getJobBids(req, res);

    expect(bidModel.getJobBids).toHaveBeenCalledWith(
      "123",
      "456",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Bids: [{ bid_id: 1, amount: 100, jobId: "123", freelancerId: "456" }],
    });
  });

  it("should return a message when no bids are found", async () => {
    bidModel.getJobBids.mockImplementationOnce(
      (jobId, freelancerId, callback) => callback(null, [])
    );

    const req = mockReq({ jobId: "123", freelancerId: "456" });
    const res = mockRes();

    await getJobBids(req, res);

    expect(bidModel.getJobBids).toHaveBeenCalledWith(
      "123",
      "456",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ Status: "Success", Bids: [] });
  });

  it("should return an error finding bids in database", async () => {
    bidModel.getJobBids.mockImplementationOnce(
      (jobId, freelancerId, callback) =>
        callback(new Error("Error finding bids"), null)
    );

    const req = mockReq({ jobId: "123", freelancerId: "456" });
    const res = mockRes();

    await getJobBids(req, res);

    expect(bidModel.getJobBids).toHaveBeenCalledWith(
      "123",
      "456",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding bids" });
  });
});

describe("getAllJobBids function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bidModel.getAllJobBids.mockReset();
  });

  it("should successfully retrieve all job bids for a given job ID", async () => {
    bidModel.getAllJobBids.mockImplementationOnce((jobId, callback) =>
      callback(null, [{ bid_id: 1, job_id: jobId, amount: 200 }])
    );

    const req = mockReq({ jobId: "123" });
    const res = mockRes();

    await getAllJobBids(req, res);

    expect(bidModel.getAllJobBids).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Bids: [{ bid_id: 1, job_id: "123", amount: 200 }],
    });
  });

  it("should return an error finding bids in database", async () => {
    bidModel.getAllJobBids.mockImplementationOnce((jobId, callback) =>
      callback(new Error("Error finding bids"), null)
    );

    const req = mockReq({ jobId: "123" });
    const res = mockRes();

    await getAllJobBids(req, res);

    expect(bidModel.getAllJobBids).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding bids" });
  });
});

describe("getSingleBid function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bidModel.getSingleBid.mockReset();
  });

  it("should successfully retrieve a single bid", async () => {
    bidModel.getSingleBid.mockImplementationOnce((bidId, callback) =>
      callback(null, [{ bid_id: bidId, amount: 200 }])
    );

    const req = mockReq({ bidId: "123" });
    const res = mockRes();

    await getSingleBid(req, res);

    expect(bidModel.getSingleBid).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Bids: { bid_id: "123", amount: 200 },
    });
  });

  it("should return an error finding bid in database", async () => {
    bidModel.getSingleBid.mockImplementationOnce((bidId, callback) =>
      callback(new Error("Error finding bid"), null)
    );

    const req = mockReq({ bidId: "123" });
    const res = mockRes();

    await getSingleBid(req, res);

    expect(bidModel.getSingleBid).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error finding bid" });
  });
});

describe("acceptBid function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bidModel.acceptBid.mockReset();
  });

  it("should successfully accept a bid", async () => {
    bidModel.acceptBid.mockImplementationOnce((bidId, jobId, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      bidId: "123",
      jobId: "456",
      freelancerName: "John Doe",
    });
    const res = mockRes();

    await acceptBid(req, res);

    expect(bidModel.acceptBid).toHaveBeenCalledWith(
      "123",
      "456",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Job has been awarded to John Doe",
    });
  });

  it("should return an error accepting bid", async () => {
    bidModel.acceptBid.mockImplementationOnce((bidId, jobId, callback) =>
      callback(new Error("Error accepting bid"), null)
    );

    const req = mockReq({
      bidId: "123",
      jobId: "456",
      freelancerName: "John Doe",
    });
    const res = mockRes();

    await acceptBid(req, res);

    expect(bidModel.acceptBid).toHaveBeenCalledWith(
      "123",
      "456",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error accepting bid" });
  });
});

describe("declineBid function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    bidModel.declineBid.mockReset();
  });

  it("should successfully decline a bid", async () => {
    bidModel.declineBid.mockImplementationOnce((bidId, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      bidId: "123",
    });
    const res = mockRes();

    await declineBid(req, res);

    expect(bidModel.declineBid).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Bid has been declined",
    });
  });

  it("should return an error declining bid", async () => {
    bidModel.declineBid.mockImplementationOnce((bidId, callback) =>
      callback(new Error("Error declining bid"), null)
    );

    const req = mockReq({
      bidId: "123",
    });
    const res = mockRes();

    await declineBid(req, res);

    expect(bidModel.declineBid).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ Error: "Error declining bid" });
  });
});

describe("getFreelancersData function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = () => ({});
  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findFreelancers.mockReset();
    freelancerModel.findFreelancerByUserId.mockReset();
  });

  it("should successfully retrieve freelancers data", async () => {
    UserModel.findFreelancers.mockImplementationOnce((callback) =>
      callback(null, [{ id: 1, name: "John Doe", email: "john@example.com" }])
    );
    freelancerModel.findFreelancerByUserId.mockResolvedValue([
      {
        description: "Web Developer",
        languages: "English",
        skills: "JavaScript",
        experienceLevel: "Expert",
        portfolioWebsite: "https://johnportfolio.com",
        rating: "5",
      },
    ]);

    const req = mockReq();
    const res = mockRes();

    await getFreelancersData(req, res);
    await new Promise(process.nextTick);

    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      freelancers: expect.any(Array),
    });
  });

  it("should return an error during database query in UserModel", async () => {
    UserModel.findFreelancers.mockImplementationOnce((callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq();
    const res = mockRes();

    await getFreelancersData(req, res);

    expect(UserModel.findFreelancers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return a message when no freelancers are found", async () => {
    UserModel.findFreelancers.mockImplementationOnce((callback) =>
      callback(null, [])
    );

    const req = mockReq();
    const res = mockRes();

    await getFreelancersData(req, res);

    expect(UserModel.findFreelancers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "No freelancers found" });
  });

  it("should handle an error retrieving additional freelancer data in freelancerModel", async () => {
    UserModel.findFreelancers.mockImplementationOnce((callback) =>
      callback(null, [{ id: 1, name: "John Doe", email: "john@example.com" }])
    );
    freelancerModel.findFreelancerByUserId.mockRejectedValue(
      new Error("Error fetching additional data")
    );

    const req = mockReq();
    const res = mockRes();

    await getFreelancersData(req, res);
    await new Promise(process.nextTick);

    expect(UserModel.findFreelancers).toHaveBeenCalled();
    expect(freelancerModel.findFreelancerByUserId).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      freelancers: expect.any(Array),
    });
  });

  it("should handle partial retrieval of additional freelancer data due to errors", async () => {
    UserModel.findFreelancers.mockImplementationOnce((callback) =>
      callback(null, [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ])
    );
    freelancerModel.findFreelancerByUserId.mockImplementation((userId) => {
      if (userId === 1) {
        return Promise.resolve([
          {
            description: "Web Developer",
            languages: "English",
            skills: "JavaScript",
            experienceLevel: "Beginner",
            portfolioWebsite: "https://johnportfolio.com",
            rating: "5",
          },
        ]);
      } else {
        return Promise.reject(new Error("Error fetching additional data"));
      }
    });

    const req = mockReq();
    const res = mockRes();

    await getFreelancersData(req, res);
    await new Promise(process.nextTick);

    expect(UserModel.findFreelancers).toHaveBeenCalled();
    expect(freelancerModel.findFreelancerByUserId).toHaveBeenCalledWith(1);
    expect(freelancerModel.findFreelancerByUserId).toHaveBeenCalledWith(2);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      freelancers: expect.any(Array),
    });
  });
});

describe("getFreelancerDataById function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findOne.mockReset();
    freelancerModel.findFreelancerById.mockReset();
  });

  it("should successfully retrieve freelancer data by ID", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, name: "John Doe", email: "john@example.com" }])
    );
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(null, [
        {
          description: "Web Developer",
          languages: "English",
          skills: "JavaScript",
          experienceLevel: "Senior",
          portfolioWebsite: "https://johnportfolio.com",
          rating: "5",
        },
      ])
    );

    const req = mockReq({ freelancerId: "1" });
    const res = mockRes();

    await getFreelancerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      "1",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      freelancer: expect.any(Object),
    });
  });

  it("should return an error during database query in UserModel", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq({ freelancerId: "1" });
    const res = mockRes();

    await getFreelancerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return a message when freelancer not found in UserModel", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );

    const req = mockReq({ freelancerId: "1" });
    const res = mockRes();

    await getFreelancerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Freelancer not found" });
  });

  it("should return an error during database query in freelancerModel", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, name: "John Doe", email: "john@example.com" }])
    );
    freelancerModel.findFreelancerById.mockImplementationOnce((id, callback) =>
      callback(new Error("Database query error in FreelancerModel"), null)
    );

    const req = mockReq({ freelancerId: "1" });
    const res = mockRes();

    await getFreelancerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(freelancerModel.findFreelancerById).toHaveBeenCalledWith(
      "1",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Error: "Database query error in FreelancerModel",
    });
  });
});

describe("submitRating function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    ratingModel.insertRating.mockReset();
  });

  it("should successfully submit a rating", async () => {
    ratingModel.insertRating.mockImplementationOnce((ratingData, callback) =>
      callback(null, { insertId: 1 })
    );

    const req = mockReq({
      freelancerId: "123",
      employerId: "456",
      rating: 5,
      review: "Great work!",
    });
    const res = mockRes();

    await submitRating(req, res);

    expect(ratingModel.insertRating).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      rating: {
        freelancerId: "123",
        employerId: "456",
        rating: 5,
        review: "Great work!",
      },
    });
  });

  it("should return an error during rating submission", async () => {
    ratingModel.insertRating.mockImplementationOnce((ratingData, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      freelancerId: "123",
      employerId: "456",
      rating: 4,
      review: "Good job!",
    });
    const res = mockRes();

    await submitRating(req, res);

    expect(ratingModel.insertRating).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });
});

describe("getResources function in userController", () => {
  const mockReq = () => ({});
  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    resourceModel.getAllResources.mockReset();
  });

  it("should successfully retrieve resources", async () => {
    resourceModel.getAllResources.mockImplementationOnce((callback) =>
      callback(null, [{ id: 1, title: "Resource 1", content: "Content 1" }])
    );

    const req = mockReq();
    const res = mockRes();

    await getResources(req, res);

    expect(resourceModel.getAllResources).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      resources: [{ id: 1, title: "Resource 1", content: "Content 1" }],
    });
  });

  it("should return an error during database query", async () => {
    resourceModel.getAllResources.mockImplementationOnce((callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq();
    const res = mockRes();

    await getResources(req, res);

    expect(resourceModel.getAllResources).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return a message when no resources are found", async () => {
    resourceModel.getAllResources.mockImplementationOnce((callback) =>
      callback(null, [])
    );

    const req = mockReq();
    const res = mockRes();

    await getResources(req, res);

    expect(resourceModel.getAllResources).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "No resources found" });
  });
});

describe("endorseSkills function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    endorsementModel.endorseSkills.mockReset();
  });

  it("should successfully endorse freelancer skills", async () => {
    endorsementModel.endorseSkills.mockImplementationOnce(
      (endorserId, freelancerId, skills, callback) =>
        callback(null, { insertId: 1 })
    );

    const req = mockReq({
      endorserId: "123",
      freelancerId: "456",
      skills: ["JavaScript", "React"],
    });
    const res = mockRes();

    await endorseSkills(req, res);

    expect(endorsementModel.endorseSkills).toHaveBeenCalledWith(
      "123",
      "456",
      ["JavaScript", "React"],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Freelancer Skills endorsed",
      endorsement: {
        endorserId: "123",
        freelancerId: "456",
        skills: ["JavaScript", "React"],
      },
    });
  });

  it("should return an error during skills endorsement", async () => {
    endorsementModel.endorseSkills.mockImplementationOnce(
      (endorserId, freelancerId, skills, callback) =>
        callback(new Error("Database error"), null)
    );

    const req = mockReq({
      endorserId: "123",
      freelancerId: "456",
      skills: ["Node.js"],
    });
    const res = mockRes();

    await endorseSkills(req, res);

    expect(endorsementModel.endorseSkills).toHaveBeenCalledWith(
      "123",
      "456",
      ["Node.js"],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });
});

describe("getEmployersData function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = () => ({});
  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findEmployers.mockReset();
    employerModel.findEmployerByUserId.mockReset();
  });

  it("should successfully retrieve employers data", async () => {
    UserModel.findEmployers.mockImplementationOnce((callback) =>
      callback(null, [{ id: 1, name: "ACME Corp", email: "contact@acme.com" }])
    );
    employerModel.findEmployerByUserId.mockResolvedValue([
      {
        description: "Tech Company",
        languages: "English",
        website: "https://acme.com",
      },
    ]);

    const req = mockReq();
    const res = mockRes();

    await getEmployersData(req, res);

    expect(UserModel.findEmployers).toHaveBeenCalled();
    expect(employerModel.findEmployerByUserId).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      employers: expect.any(Array),
    });
  });

  it("should return an error during database query in UserModel", async () => {
    UserModel.findEmployers.mockImplementationOnce((callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq();
    const res = mockRes();

    await getEmployersData(req, res);

    expect(UserModel.findEmployers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return a message when no employers are found", async () => {
    UserModel.findEmployers.mockImplementationOnce((callback) =>
      callback(null, [])
    );

    const req = mockReq();
    const res = mockRes();

    await getEmployersData(req, res);

    expect(UserModel.findEmployers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "No employers found" });
  });
});

describe("getEmployerDataById function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    UserModel.findOne.mockReset();
    employerModel.findEmployerById.mockReset();
  });

  it("should successfully retrieve employer data by ID", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [{ id: 1, name: "ACME Corp", email: "contact@acme.com" }])
    );
    employerModel.findEmployerById.mockImplementationOnce((id, callback) =>
      callback(null, [
        {
          description: "Tech Company",
          languages: "English",
          website: "https://acme.com",
        },
      ])
    );

    const req = mockReq({ employerId: "1" });
    const res = mockRes();

    await getEmployerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(employerModel.findEmployerById).toHaveBeenCalledWith(
      "1",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      employer: expect.any(Object),
    });
  });

  it("should return an error during database query in UserModel", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(new Error("Database query error"), null)
    );

    const req = mockReq({ employerId: "1" });
    const res = mockRes();

    await getEmployerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Database query error" });
  });

  it("should return a message when employer not found in UserModel", async () => {
    UserModel.findOne.mockImplementationOnce((id, callback) =>
      callback(null, [])
    );

    const req = mockReq({ employerId: "1" });
    const res = mockRes();

    await getEmployerDataById(req, res);

    expect(UserModel.findOne).toHaveBeenCalledWith("1", expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ Error: "Employer not found" });
  });
});

describe("getClusters function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.getAllClusters.mockReset();
  });

  it("should successfully retrieve clusters", async () => {
    clusterModel.getAllClusters.mockImplementationOnce((callback) =>
      callback(null, [
        { id: 1, name: "Cluster 1", description: "Description 1" },
      ])
    );

    const req = mockReq({ userId: "123" });
    const res = mockRes();

    await getClusters(req, res);

    expect(clusterModel.getAllClusters).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Clusters found",
      clusters: [{ id: 1, name: "Cluster 1", description: "Description 1" }],
    });
  });

  it("should return an error during clusters retrieval", async () => {
    clusterModel.getAllClusters.mockImplementationOnce((callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({ userId: "123" });
    const res = mockRes();

    await getClusters(req, res);

    expect(clusterModel.getAllClusters).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });

  it("should handle the case when no clusters are found", async () => {
    clusterModel.getAllClusters.mockImplementationOnce((callback) =>
      callback(null, [])
    );

    const req = mockReq({ userId: "123" });
    const res = mockRes();

    await getClusters(req, res);

    expect(clusterModel.getAllClusters).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Clusters found",
      clusters: [],
    });
  });
});

describe("updateResource function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    resourceModel.updateResource.mockReset();
  });

  it("should successfully update a resource", async () => {
    resourceModel.updateResource.mockImplementationOnce((id, data, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      id: "123",
      title: "New Title",
      category: "Education",
      description: "Updated description",
      url: "https://newurl.com",
    });
    const res = mockRes();

    await updateResource(req, res);

    expect(resourceModel.updateResource).toHaveBeenCalledWith(
      "123",
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Resource updated successfully!");
  });

  it("should return an error during resource update", async () => {
    resourceModel.updateResource.mockImplementationOnce((id, data, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      id: "123",
      title: "Another Title",
      category: "Tech",
      description: "Another description",
      url: "https://anotherurl.com",
    });
    const res = mockRes();

    await updateResource(req, res);

    expect(resourceModel.updateResource).toHaveBeenCalledWith(
      "123",
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error updating resource");
  });
});

describe("deleteResource function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    resourceModel.deleteResource.mockReset();
  });

  it("should successfully delete a resource", async () => {
    resourceModel.deleteResource.mockImplementationOnce(
      (resourceId, callback) => callback(null, { affectedRows: 1 })
    );

    const req = mockReq({ resourceId: "123" });
    const res = mockRes();

    await deleteResource(req, res);

    expect(resourceModel.deleteResource).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Resource deleted successfully!");
  });

  it("should return an error during resource deletion", async () => {
    resourceModel.deleteResource.mockImplementationOnce(
      (resourceId, callback) => callback(new Error("Database error"), null)
    );

    const req = mockReq({ resourceId: "123" });
    const res = mockRes();

    await deleteResource(req, res);

    expect(resourceModel.deleteResource).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error deleting resource");
  });
});

describe("addResource function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    resourceModel.addResource.mockReset();
  });

  it("should successfully add a resource", async () => {
    resourceModel.addResource.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1, affectedRows: 1 })
    );

    const req = mockReq({
      title: "New Resource",
      category: "Education",
      description: "Resource Description",
      url: "https://resourceurl.com",
    });
    const res = mockRes();

    await addResource(req, res);

    expect(resourceModel.addResource).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Resource added successfully",
      data: expect.any(Object),
    });
  });

  it("should return an error during resource addition", async () => {
    resourceModel.addResource.mockImplementationOnce((data, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      title: "Another Resource",
      category: "Tech",
      description: "Another Description",
      url: "https://anotherresource.com",
    });
    const res = mockRes();

    await addResource(req, res);

    expect(resourceModel.addResource).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("addCluster function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.addCluster.mockReset();
  });

  it("should successfully add a cluster", async () => {
    clusterModel.addCluster.mockImplementationOnce((data, callback) =>
      callback(null, { insertId: 1, affectedRows: 1 })
    );

    const req = mockReq({
      name: "New Cluster",
      description: "Cluster Description",
    });
    const res = mockRes();

    await addCluster(req, res);

    expect(clusterModel.addCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cluster added successfully",
      data: expect.any(Object),
    });
  });

  it("should return an error during cluster addition", async () => {
    clusterModel.addCluster.mockImplementationOnce((data, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      name: "Another Cluster",
      description: "Another Description",
    });
    const res = mockRes();

    await addCluster(req, res);

    expect(clusterModel.addCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("getClusterDataById function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (params = {}) => ({
    params,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.getClusterDataById.mockReset();
  });

  it("should successfully retrieve cluster data by ID", async () => {
    clusterModel.getClusterDataById.mockImplementationOnce((id, callback) =>
      callback(null, {
        id: "123",
        name: "Cluster 1",
        description: "Description 1",
      })
    );

    const req = mockReq({ clusterId: "123" });
    const res = mockRes();

    await getClusterDataById(req, res);

    expect(clusterModel.getClusterDataById).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Cluster found",
      cluster: expect.any(Object),
    });
  });

  it("should return an error during cluster data retrieval", async () => {
    clusterModel.getClusterDataById.mockImplementationOnce((id, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({ clusterId: "123" });
    const res = mockRes();

    await getClusterDataById(req, res);

    expect(clusterModel.getClusterDataById).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });

  it("should handle the case when cluster not found for given ID", async () => {
    clusterModel.getClusterDataById.mockImplementationOnce(
      (id, callback) => callback(null, null) // Assuming null is returned when no cluster is found
    );

    const req = mockReq({ clusterId: "123" });
    const res = mockRes();

    await getClusterDataById(req, res);

    expect(clusterModel.getClusterDataById).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Cluster found",
      cluster: null,
    });
  });

});

describe("getClustersEmployer function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.getClustersEmployer.mockReset();
  });

  it("should successfully retrieve clusters for employer", async () => {
    clusterModel.getClustersEmployer.mockImplementationOnce((callback) =>
      callback(null, [
        { id: 1, name: "Cluster 1", description: "Description 1" },
      ])
    );

    const req = mockReq({ userId: "123" });
    const res = mockRes();

    await getClustersEmployer(req, res);

    expect(clusterModel.getClustersEmployer).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Clusters found",
      clusters: [{ id: 1, name: "Cluster 1", description: "Description 1" }],
    });
  });

  it("should return an error during clusters retrieval", async () => {
    clusterModel.getClustersEmployer.mockImplementationOnce((callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({ userId: "123" });
    const res = mockRes();

    await getClustersEmployer(req, res);

    expect(clusterModel.getClustersEmployer).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });

  it("should handle the case when no clusters are found for employer", async () => {
    clusterModel.getClustersEmployer.mockImplementationOnce((callback) =>
      callback(null, [])
    );

    const req = mockReq({ userId: "123" });
    const res = mockRes();

    await getClustersEmployer(req, res);

    expect(clusterModel.getClustersEmployer).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Clusters found",
      clusters: [],
    });
  });
});

describe("joinCluster function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.joinCluster.mockReset();
  });

  it("should successfully join a cluster", async () => {
    clusterModel.joinCluster.mockImplementationOnce((memberData, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      clusterId: "123",
      freelancerId: "456",
    });
    const res = mockRes();

    await joinCluster(req, res);

    expect(clusterModel.joinCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Joined cluster successfully!",
    });
  });

  it("should return an error during joining of cluster", async () => {
    clusterModel.joinCluster.mockImplementationOnce((memberData, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      clusterId: "123",
      freelancerId: "456",
    });
    const res = mockRes();

    await joinCluster(req, res);

    expect(clusterModel.joinCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });
});

describe("leaveCluster function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.leaveCluster.mockReset();
  });

  it("should successfully leave a cluster", async () => {
    clusterModel.leaveCluster.mockImplementationOnce((memberData, callback) =>
      callback(null, { affectedRows: 1 })
    );

    const req = mockReq({
      clusterId: "123",
      freelancerId: "456",
    });
    const res = mockRes();

    await leaveCluster(req, res);

    expect(clusterModel.leaveCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      Status: "Success",
      Message: "Left cluster successfully!",
    });
  });

  it("should return an error during leaving of cluster", async () => {
    clusterModel.leaveCluster.mockImplementationOnce((memberData, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      clusterId: "123",
      freelancerId: "456",
    });
    const res = mockRes();

    await leaveCluster(req, res);

    expect(clusterModel.leaveCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ Error: "Database error" });
  });
});

describe("hireCluster function in userController", () => {
  // Utility functions for creating mock requests and responses
  const mockReq = (body = {}) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    clusterModel.hireCluster.mockReset();
  });

  it("should successfully hire a cluster", async () => {
    clusterModel.hireCluster.mockImplementationOnce((hireData, callback) =>
      callback(null, { insertId: 1, affectedRows: 1 })
    );

    const req = mockReq({
      employerId: "123",
      clusterId: "456",
    });
    const res = mockRes();

    await hireCluster(req, res);

    expect(clusterModel.hireCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Cluster hired successfully!",
      result: expect.any(Object),
    });
  });

  it("should return an error during hiring of cluster", async () => {
    clusterModel.hireCluster.mockImplementationOnce((hireData, callback) =>
      callback(new Error("Database error"), null)
    );

    const req = mockReq({
      employerId: "123",
      clusterId: "456",
    });
    const res = mockRes();

    await hireCluster(req, res);

    expect(clusterModel.hireCluster).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error hiring cluster",
      error: expect.any(Error),
    });
  });
});

describe("getRecommendedJobs function in userController", () => {
  // Mock setup
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it("should successfully retrieve recommended jobs based on skills", async () => {
    // Mock freelancer skills retrieval
    freelancerModel.getFreelancerSkills.mockImplementation((userId, callback) =>
      callback(null, [{ skills: "Python,JavaScript" }])
    );
    // Mock job retrieval based on skills
    jobModel.getJobsBySkills.mockImplementation((skillsArray, callback) =>
      callback(null, [
        { id: 1, title: "Python Developer", datePosted: new Date() },
        { id: 2, title: "JavaScript Developer", datePosted: new Date() },
      ])
    );

    const req = mockReq({ user: { id: "123" } });
    const res = mockRes();

    await getRecommendedJobs(req, res);

    expect(freelancerModel.getFreelancerSkills).toHaveBeenCalledWith(
      "123",
      expect.any(Function)
    );
    expect(jobModel.getJobsBySkills).toHaveBeenCalledWith(
      ["Python", "JavaScript"],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(Number) }),
      ])
    );
  });
});
