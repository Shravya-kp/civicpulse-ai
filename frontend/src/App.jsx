import { useState } from 'react';

export default function App() {
  const [reportText, setReportText] = useState("");
  const [reports, setReports] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // THE REAL API CALL TO YOUR BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText) return;
    setIsProcessing(true);

    try {
      // Pointing to your local Node.js server
      // Replace 'http://localhost:5000' with the environment variable
const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reportText })
});;

      const data = await response.json();
      
      // Update the board with the live Gemini data
      setReports([data, ...reports]);
      setReportText("");
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Uh oh! Could not reach the backend. Is node server.js running in your terminal?");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for dynamic severity colors based on Gemini's score
  const getSeverityColor = (score) => {
    if (score >= 4) return "bg-red-100 text-red-800 border-red-200";
    if (score === 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* The Reporting Portal */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📢 Report an Issue</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
              rows="5"
              placeholder="E.g., Massive water pipe burst near the university main gate, the street is flooding!"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isProcessing ? "Processing via AI..." : "Submit Report"}
            </button>
          </form>
        </div>

        {/* The Live AI Triage Board */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🛡️ Live Admin Triage Board</h2>
          {reports.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
              No reports active. Waiting for secure data ingestion...
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-700 uppercase tracking-wider text-sm">{report.category}</span>
                      
                      {/* Only flashes red if Gemini flags it as immediate dispatch */}
                      {report.requires_immediate_dispatch && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">🔥 URGENT DISPATCH</span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium">{report.actionable_summary}</p>
                    <p className="text-sm text-gray-500 mt-1">📍 {report.geo_context}</p>
                  </div>
                  
                  {/* Dynamic Level Badge */}
                  <div className={`px-4 py-2 rounded-lg border font-bold text-lg text-center min-w-[80px] ${getSeverityColor(report.severity_score)}`}>
                    Lvl {report.severity_score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}