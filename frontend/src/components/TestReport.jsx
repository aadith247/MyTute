import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { api ,API_BASE_URL} from "../api/config";
const TestReport = () => {
    const [pdfData, setPdfData] = useState(null);
    const [testInfo, setTestInfo] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const { courseId, testId } = useParams();

    useEffect(() => {

        const fetchReport = async () => {
           
                const response = await axios.get(`${API_BASE_URL}/student/course/${courseId}/${testId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (!response.data) {
                    throw new Error('Failed to fetch report');
                }

               
                setPdfData(response.data.pdfData);
                setTestInfo(response.data.testInfo);
                // setLoading(false);

            
        };
     
        fetchReport();
    }, [courseId, testId]);

    // if (loading) {
    //     return <div className="flex justify-center items-center min-h-screen">
    //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    //     </div>;
    // }

    // if (error) {
    //     return <div className="text-red-500 text-center p-4">{error}</div>;
    // }

    return (
        <div className="container mx-auto p-4">
         
            {testInfo && (

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                 
                    <h1 className="text-2xl font-bold mb-4">{testInfo.title}</h1>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-600">Score</p>
                            <p className="text-2xl font-bold">{testInfo.score}/{testInfo.totalQuestions}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-600">Percentage</p>
                            <p className="text-2xl font-bold">{testInfo.percentage}%</p>
                        </div>
                    </div>
                </div>
            )}
            
            {pdfData && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Detailed Report</h2>
                    <iframe
                        src={`data:application/pdf;base64,${pdfData}`}
                        className="w-full h-[800px] border-0"
                        title="Test Report"
                    />
                </div>
            )}
        </div>
    );
};

export default TestReport;