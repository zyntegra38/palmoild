import { useState, useEffect,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import fb from '../images/fb.png';
import link from '../images/link.png';
import goog from '../images/goog.png';
import Select from 'react-select';
import PasswordStrengthBar from 'react-password-strength-bar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const RegisterScreen = () => {
  const [showFirstSection, setShowFirstSection] = useState(true);
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [pricingData, setPricingData] = useState(null);
  const [pricingPremiumData, setPricingPremiumDataData] = useState(null);
  const form = useRef();
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    country_id: '',
    mobile: '',
    password: '',
    agreeTerms: '',
    confirmPassword: '',
  });  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    address2:'',
    country_id: '',
    mobile: '',
    password: '',
    agreeTerms: '',
    confirmPassword: '', 
  });

  const fetchPricingData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/pricing-basic`);
      setPricingData(response.data);
      const responsePre = await axios.get(`${BACKEND_URL}api/cmsdata/pricing-premium`);
      setPricingPremiumDataData(responsePre.data);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;
  
    if (!formData.name.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        name: 'Contact name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        name: '',
      }));
    }
  
    if (!formData.email.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email is required',
      }));
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email format is not correct',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: '',
      }));
    }
  
    if (!formData.company.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        company: 'Company name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        company: '',
      }));
    }
  
    if (!formData.address.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: 'Address is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: '',
      }));
    }
  
    if (!formData.country_id.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        country_id: 'Country is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        country_id: '',
      }));
    }
  
    if (!formData.mobile.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: 'Mobile is required',
      }));
      isValid = false;
    } else if (!/^\+?\d+$/.test(formData.mobile.trim())) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: 'Mobile number should contain only digits',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: '',
      }));
    }
    
    if (!password.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        password: 'Password is required',
      }));
      isValid = false;
    } else if (password.trim().length < 6) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        password: 'Password must be at least 6 characters long',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        password: '',
      }));
    }
  
    if (!formData.confirmPassword.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: 'Confirm Password is required',
      }));
      isValid = false;
    } else if (formData.confirmPassword.trim() !== password.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: '',
      }));
    }
    if (!agreeTerms) { 
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        agreeTerms: 'Please agree to Terms and Conditions',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        agreeTerms: '', 
      }));
    }          
    return isValid;
  };
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinueClick = () => {
    const isValid = validateForm() ;
    if (isValid) {
      setShowFirstSection(false);
      setShowSecondSection(true);
    }   
  };

  const handleBackClick = () => {
      setShowFirstSection(true);
      setShowSecondSection(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const { name, email, company, address, address2, country_id, mobile } = formData;
    
    var templateParams = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const transaction_id='';
      const status=0;
      setLoading(true);
      navigate("/");
      const res = await register({ name, email, password, address, address2, country_id, mobile, company ,transaction_id,status}).unwrap();
      dispatch(setCredentials({ ...res }));
      await axios.post(`${BACKEND_URL}api/mailer/send-welcome-mail`, templateParams);
      toast.success('Registration Successful');            
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message === "User already exists") {
        toast.error("User already exists with this same email id");
        handleBackClick();
      }else if (err.response && err.response.data && err.response.data.message === "company already exists") {
        toast.error("User already exists with this same Company name");
        handleBackClick();
      } else {
        toast.error(err?.data?.message || err.error);
        handleBackClick();
      }      
      
    }        
  };  

  useEffect(() => {
      const fetchCountriesAndCategories = async () => {
        try {
            const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
            setCountries(countriesResponse.data);
        } catch (error) {
            console.error('Error fetching countries and categories:', error);
        }
      };
      fetchCountriesAndCategories();
      fetchPricingData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleGoogleAuth = () => {
    try{
      const res = window.open(`${BACKEND_URL}auth/google`, "_self");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }    
  };

  const handleLinkedAuth = () => {
    try{
      const res = window.open(`${BACKEND_URL}auth/linkedin`, "_self");      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } 
  };

  const facebookAuth = () => {
    try{
      const res = window.open(`${BACKEND_URL}auth/facebook`, "_self");      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }  
  };
  const options = countries.map(country => ({
    value: country._id,
    label: country.name
  }));

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);    
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    handleInputChange({ target: { name: 'country_id', value: selectedOption.value } });
  };
  

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
      setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

  const parseHtmlToList = (htmlString) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;  
    const listItems = Array.from(tempDiv.querySelectorAll('li')).map(li => {
      const description = li.textContent.trim().replace(/^[\u2713\u2718]/, '').trim();  
      return {
        description,
        available: li.textContent.includes('✓')
      };
    });  
    return listItems;
  };
  
  const renderCmsContent = (content) => {
    if (!Array.isArray(content)) return null;
    return content.map((item, index) => (
      <li key={index} className="flex items-center mb-2">
        <span className={`inline-block w-4 h-4 ${item.available ? 'bg-green-800' : 'bg-red-800'} text-white rounded-full flex-shrink-0 mr-2 flex justify-center items-center`}>
          {item.available ? '✓' : '✘'}
        </span>
        <span className="font-semibold">{item.description}</span>
      </li>
    ));
  };  
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);
  
  const handlePayment = async () => {
    
    if (!razorpayLoaded) return;
    const response = await fetch(`${BACKEND_URL}create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 7495 }), // Example amount in paise for ₹74.95
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error(orderData.error);
      alert("Failed to create order. Please try again.");
      return;
    }

    const options = {
      key: 'rzp_live_NCXCXBQAFe6FUE', // Use an environment variable
      amount: orderData.amount,
      currency: 'USD',
      name: 'Palmoil Directory',
      description: 'Test Transaction',
      image: 'https://your-logo-url.com/logo.png',
      order_id: orderData.id,
      handler: function (response) {
        handleSubmitt(response.razorpay_payment_id);
        // Optionally verify payment on the server
      },
      prefill: {
        name: 'PalmOil Directory',
        
      },
      notes: {
        address: 'note value',
      },
      theme: {
        color: '#F37254',
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  
  const handleSubmitt = async (transaction_id) =>{
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const { name, email, company, address, address2, country_id, mobile } = formData;
    
    var templateParams = {
      name: name,
      email: email,
      password: password,
    };
    try {
      setLoading(true);
      const status =1;
      // navigate("/subscribe");
      const res = await register({ name, email, password, address, address2, country_id, mobile, company, transaction_id,status}).unwrap();
      dispatch(setCredentials({ ...res }));
      setLoading(false);
      await axios.post(`${BACKEND_URL}api/mailer/send-welcome-mail`, templateParams);
      const currentDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); 
      const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      const formattedExpiryDate = `${expiryDate.getMonth() + 1}/${expiryDate.getDate()}/${expiryDate.getFullYear()}`;

      var templateParamss = {
          name: name,
          email: email,
          date:formattedCurrentDate,
          expiry_date:formattedExpiryDate,
          amount_paid:'74.95',
          transaction_id:transaction_id, 
      };
      await axios.post(`${BACKEND_URL}api/mailer/send-payment-mail`, templateParamss);

      toast.success('Registration Successful');           
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message === "User already exists") {
        toast.error("User already exists with this same email id");
        handleBackClick();
      }else if (err.response && err.response.data && err.response.data.message === "company already exists") {
        toast.error("User already exists with this same Company name");
        handleBackClick();
      } else {
        toast.error(err?.data?.message || err.error);
        handleBackClick();
      }     
    }  
  }
  return (
    <div>      
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <section className="bg-white">    
        <div className="container mx-auto my-0 w-8/12 pt-10">
          <h2 className="font-bold text-2xl text-center font-raleway">Register</h2>
          {showFirstSection && (
          <div className="reg-first-section">
            <div className="StepIndicator mt-8 mb-10">
              <div className="StepText">
                <span className="Number ">Step 1</span>
                <div className="Line" />
              </div>
            </div>
            <div className="social_bt mt-8 text-center">
              <button
                type="submit"
                className="w-3.4/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mr-2 mt-4 sig font-semibold"
                onClick={handleGoogleAuth} > <img src={goog} alt="Google" className="pr-2"/>
                Sign in with Google
              </button>
              {/* <button
                type="submit"
                className="w-3.4/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mx-2 mt-4 sig font-semibold"
                onClick={handleLinkedAuth} > 
                <img src={link} alt="Linked In" className="pr-2"/>
                  Sign in with LinkedIn
              </button> */}
              {/* <button
                type="submit"
                className="text-center w-3.4/12 rounded-md border font-raleway text-gray-600 text-sm ml-2 px-6 py-3 mt-4 mb-4 sig font-semibold"
                onClick={facebookAuth} > <img src={fb} alt="Facebook" className="pr-2"/>
                Sign in with Facebook
              </button> */}
            </div>
            <div className="or_with pl-5 mr-5 text-center relative my-5"><p className="font-lato text-sm text-gray-500">Or with email</p></div>
          </div>
          )}
          <form className="mt-8" ref={form}  onSubmit={handleSubmit}>
          {showFirstSection && (
            <div className="reg-first-section">
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text"
                  name="name"
                  id="name"
                  placeholder='Contact Name  *'
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                  {validationErrors.name && <p className="text-red-500 text-xs italic">{validationErrors.name}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder='Email Address  *'
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.email && <p className="text-red-500 text-xs italic">{validationErrors.email}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="company" 
                  id="company" 
                  placeholder='Company *'
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.company && <p className="text-red-500 text-xs italic">{validationErrors.company}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <Select
                  value={selectedOption}
                  name="country_id" 
                  onChange={handleChange}
                  options={options}
                  className="w-full rounded border font-lato text-gray-400 text-sm focus:outline-none font-semibold"
                  placeholder="Country *"
                />
                {validationErrors.country_id && <p className="text-red-500 text-xs italic">{validationErrors.country_id}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="mobile" 
                  id="mobile" 
                  placeholder="Mobile Number  *"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.mobile && <p className="text-red-500 text-xs italic">{validationErrors.mobile}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  placeholder='Address  *'
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.address && <p className="text-red-500 text-xs italic">{validationErrors.address}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="address2" 
                  id="address2" 
                  placeholder='Address2  '
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
              </div>              
              
              <div className="w-6/12 inline-block pr-4 pb-4">
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} // Toggle between text and password type
                        name="password"
                        placeholder="Password *"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-0 top-0 mt-3 mr-4"
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Show eye icon based on visibility state */}
                    </button>
                </div>
                {validationErrors.password && <p className="text-red-500 text-xs italic">{validationErrors.password}</p>}
              </div>              
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder= "Confirm Password  *"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  <PasswordStrengthBar password={password} />
                  {validationErrors.confirmPassword && <p className="text-red-500 text-xs italic">{validationErrors.confirmPassword}</p>}
              </div>
              <div className="w-12/12 inline-block pr-4 pb-4">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  name="agreeTerms"
                  checked={agreeTerms} 
                  onChange={handleCheckboxChange} 
                  className="mr-2" />
                <label htmlFor="agreeTerms">
                  I AGREE TO TERMS AND CONDITIONS. YOU WILL RECEIVE OUR BI-WEEKLY EMAIL NEWSLETTER AND MAY UNSUBSCRIBE AT ANYTIME.
                </label>
                {validationErrors.agreeTerms && <p className="text-red-500 text-xs italic">{validationErrors.agreeTerms}</p>}
              </div>
              <div className="my-5 mr-3.5 text-center">
                <button className="w-5/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
                    onClick={handleContinueClick} > Continue </button>
              </div> 
            </div>  
            )}                       
                        
          </form>
          <div className={`reg-second-section ${showSecondSection ? '' : 'hidden'}`}>
              <div className="StepIndicator mt-8 mb-10">
                <div className="StepText">
                  <span className="Number ">Step 2</span>
                  <div className="Line" />
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LazyLoadingSpinner />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-center items-stretch md:space-x-8 space-y-8 md:space-y-0 mt-8">
                  <div className="flex flex-col justify-between bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-lg shadow-lg w-full md:w-5/12 transform transition-transform duration-300 hover:scale-105" id="freeBox">
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="font-raleway mb-4 text-lg text-center font-semibold text-gray-700">Basic</h4>
                        <h2 className="font-bold text-3xl text-center text-gray-800 font-raleway mb-2">Free</h2>
                        <p className="text-center text-sm text-gray-600 mt-2">(Only for one month)</p>
                      </div>
                      <div className="mt-6">
                        <ul className="text-sm text-gray-700">
                          {pricingData && (
                            <ul>
                              {renderCmsContent(parseHtmlToList(pricingData.cms_content))}
                            </ul>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="my-6 mx-6 text-center">
                      <input className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-24 rounded-lg shadow-md transition duration-200" 
                        onClick={handleSubmit} type="submit" name="yt0" id="signupButton" value="Get Started" />
                    </div>
                  </div>
                  <div className="relative flex flex-col justify-between bg-gradient-to-br from-white to-gray-100 p-8 rounded-lg shadow-lg w-full md:w-5/12 transform transition-transform duration-300 hover:scale-105" id="paidBox">
                    <div className="absolute top-0 right-0 bg-orange-600 text-white font-semibold py-1 px-3 rounded-bl-lg">Best Value</div>
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="font-raleway mb-4 text-lg text-center font-semibold text-gray-700">Premium</h4>
                        <h2 className="font-bold text-3xl text-center text-gray-800 font-raleway mt-2 mb-1">$74.95/year</h2>
                        <s className="text-center text-sm text-gray-500 block">Normally $100/year</s>
                        <div className="relative text-center mt-6">
                          <p className="text-sm text-white-600 font-semibold py-1 px-3">Save $26.05!</p>
                          <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-300 to-yellow-600 opacity-50 w-full h-full rounded-lg shadow-md"></div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <ul className="text-sm text-gray-700">
                          {pricingPremiumData && (
                            <ul>
                              {renderCmsContent(parseHtmlToList(pricingPremiumData.cms_content))}
                            </ul>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="my-6 mx-6 text-center">
                      <input className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-24 rounded-lg shadow-md transition duration-200" 
                        type="submit" onClick={handlePayment} name="yt0" id="signupButton" value="Get Started" />                 
                    </div>
                  </div>
                </div>
              )}
              <div className="my-5 mr-3.5 text-center">
                <a href="#" onClick={handleBackClick}>Back</a>                
              </div>
            </div>
        </div>
      </section> 
    </div> 
  );
};

export default RegisterScreen;
