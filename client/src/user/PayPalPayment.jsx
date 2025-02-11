import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import { useSubscribeMutation } from "../slices/usersApiSlice";
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
    <div className="spinner"></div>
  );

const PayPalButton = () => {
    const [formData, setFormData] = useState({
        company: '',
        address: '',
        address2: '',
        country_id: '',
        mobile: '',
    });
    const [validationErrors, setValidationErrors] = useState({
        company: '',
        address: '',
        country_id: '',
        mobile: '',
    });  
    const [showFirstSection, setShowFirstSection] = useState(true);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [showSecondSection, setShowSecondSection] = useState(false);
    const [pricingData, setPricingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pricingPremiumData, setPricingPremiumDataData] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updateProfile, { isLoading }] = useSubscribeMutation();
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const validateForm = () => {
        let isValid = true;       
      
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
        } else {
          setValidationErrors(prevErrors => ({
            ...prevErrors,
            mobile: '',
          }));
        }
      
        return isValid;
    };

    const fetchPricingData = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}api/cmsdata/pricing-basic`);
          setPricingData(response.data);
          const responsePre = await axios.get(`${BACKEND_URL}api/cmsdata/pricing-premium`);
          setPricingPremiumDataData(responsePre.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching pricing data:', error);
          setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        try {
            const res = await updateProfile({
                userId: userInfo._id,
                name:userInfo.name,
                email:userInfo.email,
                country_id: formData.country_id,
                company: formData.company,
                address: formData.address,
                address2: formData.address2,
                mobile: formData.mobile,
                transactionId: "",
                ExpiryDate: "",
                status:0
            }).unwrap();
            dispatch(setCredentials(res));
            // toast.success("Profile updated successfully");
            navigate("/subscribe");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    
    const [countries, setCountries] = useState([]);
    
    useEffect(() => {
        const fetchCountriesAndCategories = async () => {
            try {
                const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
                setCountries(countriesResponse.data);
            } catch (error) {
                console.error('Error fetching countries and categories:', error);
            }
        };
        fetchPricingData();
        fetchCountriesAndCategories();
    }, []);

    const handleContinueClick = () => {
        const isValid = validateForm();
        if (isValid) {
          setShowFirstSection(false);
          setShowSecondSection(true);
        }   
    };
    
    const handleBackClick = () => {
        setShowFirstSection(true);
        setShowSecondSection(false);
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
            key: 'rzp_test_S49jRpzo4Muzlh', // Use an environment variable
            amount: orderData.amount,
            currency: 'USD',
            name: 'Palmoil Directory',
            description: 'Test Transaction',
            image: 'https://your-logo-url.com/logo.png',
            order_id: orderData.id,
            handler: function (response) {
                handleSubmitt(response.razorpay_payment_id);        
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

    const handleSubmitt = async (transaction_id) => {
        const currentDate = new Date();
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); 
        const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        const formattedExpiryDate = `${expiryDate.getMonth() + 1}/${expiryDate.getDate()}/${expiryDate.getFullYear()}`;

        alert(transaction_id);
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        try {
            const res = await updateProfile({
                userId: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                country_id: formData.country_id,
                company: formData.company,
                address: formData.address,
                address2: formData.address2,
                mobile: formData.mobile,
                transactionId: transaction_id,
                expiryDate:formattedExpiryDate,
                status:1
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Payment successfully completed ");
            var templateParamss = {
                name: userInfo.name,
                email: userInfo.email,
                date:formattedCurrentDate,
                expiry_date:formattedExpiryDate,
                amount_paid:'74.95',
                transaction_id:transactionId, 
            };
            await axios.post(`${BACKEND_URL}api/mailer/send-payment-mail`, templateParamss);
            navigate("/");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    const [conversionRate, setConversionRate] = useState(0);
    const [usdAmount, setUsdAmount] = useState(74.95); // Set this to your price
    const [inrAmount, setInrAmount] = useState(0);

    useEffect(() => {
        const fetchConversionRate = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
            setConversionRate(response.data.rates.INR);
            setInrAmount(usdAmount * response.data.rates.INR);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
        }
        };

        fetchConversionRate();
    }, [usdAmount]);

    const handleUsdChange = (e) => {
        const value = parseFloat(e.target.value);
        setUsdAmount(value);
        setInrAmount(value * conversionRate);
    };
    const handlePayments = async () => {
    
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
          key: 'rzp_test_S49jRpzo4Muzlh', // Use an environment variable
          amount: orderData.amount,
          currency: 'USD',
          name: 'Palmoil Directory',
          description: 'Test Transaction',
          image: 'https://your-logo-url.com/logo.png',
          order_id: orderData.id,
          handler: function (response) {
            console.log(response);
            const { email, contact } = response;  // Razorpay response contains the email and contact info
            console.log("User Email: ", email);
            console.log("User Contact Number: ", contact);
            handleSubmits(response.razorpay_payment_id);        
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
    const handleSubmits = async (transactionId) => {
        const currentDate = new Date();
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); 
        const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        const formattedExpiryDate = `${expiryDate.getMonth() + 1}/${expiryDate.getDate()}/${expiryDate.getFullYear()}`;
    
        try {
            const res = await updateProfile({
                userId: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                country_id: userInfo.country_id,
                company: userInfo.company,
                address: userInfo.address,
                address2: userInfo.address2,
                mobile: userInfo.mobile,
                transactionId: transactionId,
                expiryDate:formattedExpiryDate,
                status:1
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            var templateParamss = {
                name: userInfo.name,
                email: userInfo.email,
                date:formattedCurrentDate,
                expiry_date:formattedExpiryDate,
                amount_paid:'74.95',
                transaction_id:transactionId, 
            };
            await axios.post(`${BACKEND_URL}api/mailer/send-payment-mail`, templateParamss);
            navigate("/");
            toast.success("Payment successfully completed ");
            navi
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    return (
        <div>
            <Helmet>
                <title>PalmOil Directory, Subscribe</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>    
            </Helmet>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <section className="bg-white">    
                <div className="container mx-auto my-0 w-6/12 pt-10" style={{ display: userInfo.company ? 'none' : 'block' }}>
                    <h2 className="font-bold text-2xl text-center font-raleway">Complete Registation</h2>
                    {showFirstSection && (
                        <div className="reg-first-section">
                            <div className="StepIndicator mt-8 mb-10">
                            <div className="StepText">
                                <span className="Number ">Step 2</span>
                                <div className="Line" />
                            </div>
                            </div>
                        </div>
                    )}
                    <form className="mt-8"  onSubmit={handleSubmit}>
                        {showFirstSection && (
                            <div className="reg-first-section">
                                <div className="my-5 mr-3.5 text-center">
                                    <input 
                                        type="text" 
                                        name="company" 
                                        id="company" 
                                        placeholder='Company  *'
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-8/12 rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                                        {validationErrors.company && <p className="text-red-500 text-xs italic">{validationErrors.company}</p>}
                                </div>
                                <div className="my-5 mr-3.5 text-center">
                                    <input 
                                        type="text" 
                                        name="address" 
                                        id="address" 
                                        placeholder='Address  *'
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-8/12 rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                                        {validationErrors.address && <p className="text-red-500 text-xs italic">{validationErrors.address}</p>}
                                </div>
                                <div className="my-5 mr-3.5 text-center">
                                    <input 
                                        type="text" 
                                        name="address2" 
                                        id="address2" 
                                        placeholder='Address2  '
                                        value={formData.address2}
                                        onChange={handleInputChange}
                                        className="w-8/12 rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                              </div>
                                <div className="my-5 mr-3.5 text-center">
                                    <select
                                        id="country_id"
                                        className="w-8/12 rounded border px-6 py-3 font-lato text-gray-400 text-sm focus:outline-none font-semibold"
                                        type="text"
                                        name="country_id"
                                        value={formData.country_id}
                                        onChange={handleInputChange} >
                                        <option className="text-sm font-lato text-gray-600 font-semibold" value="">
                                            Country *
                                        </option>
                                        {countries.map((country) => (
                                            <option key={country._id} value={country._id}>
                                            {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.country_id && <p className="text-red-500 text-xs italic">{validationErrors.country_id}</p>}
                                </div>
                                <div className="my-5 mr-3.5 text-center">
                                    <input 
                                    type="text" 
                                    name="mobile" 
                                    id="mobile" 
                                    placeholder="Mobile Number  *"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="w-8/12 rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                                    {validationErrors.mobile && <p className="text-red-500 text-xs italic">{validationErrors.mobile}</p>}
                                </div>
                                <div className="my-5 mr-3.5 text-center">
                                    <button className="w-4/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
                                        onClick={handleContinueClick} > Continue </button>
                                </div> 
                            </div>  
                        )}                       
                                  
                    </form>
                    <div className={`reg-second-section ${showSecondSection ? '' : 'hidden'}`}>
                        <div className="StepIndicator mt-8 mb-10">
                            <div className="StepText">
                            <span className="Number ">Step 3</span>
                            <div className="Line" />
                            </div>
                        </div>
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
                                    <input className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200" 
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
                                    <input className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200" 
                                    type="submit"  onClick={handlePayment}  name="yt0" id="signupButton" value="Get Started" />
                                </div>
                            </div>
                        </div>
                        <div className="my-5 mr-3.5 text-center">
                            <a href="#" onClick={handleBackClick}>Back</a>                
                        </div>
                    </div>  
                </div>
                <section className="bg-white py-10" style={{ display: userInfo.company ? 'block' : 'none' }}>
                    <div className="container mx-auto w-11/12 md:w-8/12">
                        <h2 className="font-bold text-3xl text-center text-gray-800 font-raleway mb-4">Our Pricing Plans</h2>
                        <p className="text-base text-center text-gray-600 font-raleway pb-3">Get access to the Largest Marketplace of companies in the Palm Oil Industry.</p>
                        <div className="reg-second-section">
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
                                        <Link className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link> :
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
                                        <div className="currency-converter flex justify-center items-center mt-1">
                                            <span className="text-gray-700 text-sm mr-2">USD</span>
                                            <input
                                                type="number"
                                                value={usdAmount}
                                                onChange={handleUsdChange}
                                                className="border border-gray-300 p-1 rounded-lg text-sm w-24"
                                                placeholder="Amount"
                                            />
                                            <span className="text-gray-700 text-sm mx-2">=</span>
                                            <p className="text-gray-800 text-sm">
                                                {loading ? 'Loading...' : `${inrAmount.toFixed(2)} INR`}
                                            </p>
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
                                        <Link onClick={handlePayments} className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link>
                                    </div>                            
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </section>
            </section> 
        </div>        
    );
};

export default PayPalButton;