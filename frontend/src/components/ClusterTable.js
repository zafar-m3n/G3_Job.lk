import React from "react";
const ClusterTable = ({ clusters, onClusterChange, role }) => {
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
          {clusters.map((cluster) => (
            <tr key={cluster.cluster_id}>
              <td className="col-2">{cluster.cluster_name}</td>
              <td className="col-5">{cluster.cluster_description}</td>
              <td className="col-2">{cluster.member_count}</td>
              <td className="col-3">
                <a
                  className="btn btn-outline-info mx-1"
                  href={`/freelancer-clusters/${cluster.cluster_id}`}
                >
                  View
                </a>
                {role === "admin" && (
                  <>
                    <button className="btn btn-outline-primary mx-1">
                      Edit
                    </button>
                    <button className="btn btn-outline-danger mx-1">
                      Remove
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClusterTable;
