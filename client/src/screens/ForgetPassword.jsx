import { useState, React} from 'react'
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../constans";


const ForgetPassword = () => {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [FormData, setFormData] = useState({
        email:'',
    });
    const validateForm = () => {
        let isValid = true;
        const emailRegex = /\S+@\S+\.\S+/;
        if (!FormData.email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!emailRegex.test(FormData.email)) {
            setEmailError('Email format is not correct');
            isValid = false;
        } else {
            setEmailError('');
        }
        return isValid;
    };
     
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post(`${ BACKEND_URL }api/users/forget-password`, FormData);
            const { email, name, resetPasswordToken } = response.data;
            var templateParams = {
                email: email,
                name: name,
                resetPasswordToken: resetPasswordToken,
            };
            const response2 =await axios.post(`${BACKEND_URL}api/mailer/send-reset-mail`, templateParams);
            if(response2.data.message=="Success"){
                toast.success('Reset email successfully sent to the provided email address.');   
                navigate('/');         
            }else{
                toast.error('Failed to send reset email to the provided email address.');           
            }            
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message === "account error") {
                toast.error(`The email ${FormData.email} is not associated with any account`);
            } else {
                toast.error(err?.data?.message || err.error);
            }            
        }
    };
    const closePopup = () => {
        navigate('/');
    };
    
    return (
       <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <button
                className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
                onClick={closePopup} > X 
            </button>
            <div>
                <h3 className="font-bold text-2xl text-center font-raleway">Reset your password</h3>
                <h5 className="font-lato text-sm text-gray-600 mt-2">Enter your email address and we will send you a new password</h5>
            </div>	  
            <div className="mt-4">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="mb-6 pt-3 rounded"><input 
                      type="text" 
                      name="email" 
                      placeholder='Email'
                      value={FormData.email}
                      onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
                      className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                        {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                  </div>
                  
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"type="submit">
                    Send password reset email
                  </button>
                </form>
            </div>
            </div>
    )
}
export default ForgetPassword;
