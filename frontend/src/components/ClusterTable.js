import React, { useState, useEffect } from "react";
import axios from "axios";

const ResourcesTable = () => {
  const [clusterData, setClusterData] = useState([]);
  const getClusterData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getClusters", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Cluster Data:" + JSON.stringify(res.data, null, 2));
      setClusterData(res.data.clusters);
    } catch (error) {
      console.error("Error fetching resources data:", error);
    }
  };

  useEffect(() => {
    getClusterData();
  }, []);

  return (
    <div className="table-responsive w-100">
      <table className="table table-striped align-middle w-100">
        <thead>
          <tr>
            <th className="col-2">Cluster Name</th>
            <th className="col-5">Cluster Description</th>
            <th className="col-2">Member Count</th>
            <th className="col-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clusterData.map((cluster) => (
            <tr key={cluster.cluster_id}>
              <td className="col-2">{cluster.cluster_name}</td>
              <td className="col-5">{cluster.cluster_description}</td>
              <td className="col-2">{cluster.member_count}</td>
              <td className="col-3">
                <button className="btn btn-outline-info mx-1">View</button>
                <button className="btn btn-outline-primary mx-1">Edit</button>
                <button className="btn btn-outline-danger mx-1">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
