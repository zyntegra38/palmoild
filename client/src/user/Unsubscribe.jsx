import React, { useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { ToastContainer, toast } from 'react-toastify';

const Unsubscribe = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [reason, setReason] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();  
        try {
            await axios.post(`${BACKEND_URL}api/mailer/unsubscribe/${email}`, { reason });
            navigate(`/`);  
            toast.success('Successfully Unsubscribed!');
        } catch (error) {
            console.error("Error unsubscribing:", error);
        }
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    return (
      <section className="bg-white py-8" id="about">
        <div className="container max-w-5xl mx-auto">
            <div className="flex flex-col items-center bg-blue-500 text-white p-4">
                <div className="text-center">
                    <p className="text-sm font-medium">You have unsubscribed from this email</p>
                    <p className="text-xs">You will no longer receive emails about this palmoildirectory</p>
                    <button  
                        className="mt-2 text-blue-500 bg-white px-3 py-1 rounded shadow hover:bg-gray-200"
                        onClick={() => navigate('/')} // You can use navigate for 'undo' to return to home page
                    >
                        Undo
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center mt-6">
                <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded p-6 w-96">
                    <fieldset>
                    <legend className="text-lg font-semibold text-gray-700 mb-4">Would you mind telling us why you unsubscribed? (optional)</legend>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input 
                                type="radio" 
                                name="reason" 
                                value="indeed" 
                                className="mr-2"
                                checked={reason === 'indeed'}
                                onChange={handleReasonChange}
                            />
                            <span className="text-gray-600">I'm not interested in this website</span>
                        </label>
                        <label className="flex items-center">
                            <input 
                                type="radio" 
                                name="reason" 
                                value="other" 
                                className="mr-2"
                                checked={reason === 'other'}
                                onChange={handleReasonChange}
                            />
                            <span className="text-gray-600">Other</span>
                        </label>
                    </div>
                    </fieldset>

                    <button type="submit" className="mt-4 w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            </div>
        </div>
      </section>
    );
};

export default Unsubscribe;
