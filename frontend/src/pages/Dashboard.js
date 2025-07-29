import React, { useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPredictions([]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://creditwise-backend.onrender.com/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPredictions(res.data.predictions);
    } catch (err) {
      setError("Prediction failed. Please check your file and backend.");
    }
    setLoading(false);
  };

  function getRiskCounts(predictions) {
    const counts = { Low: 0, Medium: 0, High: 0 };
    predictions.forEach((p) => {
      const risk = (p.risk || "").toString().trim().toLowerCase();
      if (risk === "low") counts.Low++;
      else if (risk === "medium") counts.Medium++;
      else if (risk === "high") counts.High++;
    });
    return counts;
  }

  // Debugging output
  console.log("Predictions:", predictions);
  console.log("Risk counts:", getRiskCounts(predictions));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center tracking-tight">Credit Risk Prediction Dashboard</h2>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 justify-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full md:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Predicting...</span>
            ) : (
              "Upload & Predict"
            )}
          </button>
        </div>
        {error && <div className="text-red-600 mb-4 text-center font-semibold">{error}</div>}
        {predictions.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div style={{ width: 300, height: 300 }}>
              <h3 className="text-lg font-semibold mb-2 text-center">Risk Group Distribution</h3>
              <Pie
                data={{
                  labels: Object.keys(getRiskCounts(predictions)),
                  datasets: [
                    {
                      data: Object.values(getRiskCounts(predictions)),
                      backgroundColor: ["#60a5fa", "#fbbf24", "#ef4444"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: true, position: "bottom" },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        )}
        {predictions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border-b font-semibold">#</th>
                  <th className="px-4 py-2 border-b font-semibold">Risk</th>
                  <th className="px-4 py-2 border-b font-semibold">Probability</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                    <td className={`px-4 py-2 border-b text-center font-bold ${pred.risk === "Low" ? "text-blue-600" : pred.risk === "Medium" ? "text-yellow-600" : "text-red-600"}`}>{pred.risk}</td>
                    <td className="px-4 py-2 border-b text-center">{(pred.probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
