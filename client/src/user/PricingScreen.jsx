import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';
import { useSubscribeMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const PricingScreens = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [pricingData, setPricingData] = useState(null);
  const [pricingPremiumData, setPricingPremiumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [updateProfile, { isLoading }] = useSubscribeMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}api/cmsdata/pricing-basic`);
        setPricingData(response.data);
        const responsePremium = await axios.get(`${BACKEND_URL}api/cmsdata/pricing-premium`);
        setPricingPremiumData(responsePremium.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

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
      key: 'rzp_test_S49jRpzo4Muzlh', 
      amount: orderData.amount,
      currency: 'USD',
      name: 'Palmoil Directory',
      description: 'Test Transaction',
      image: 'https://your-logo-url.com/logo.png',
      order_id: orderData.id,
      handler: function (response) {
      const paymentId = response.razorpay_payment_id;

      fetch(`${BACKEND_URL}get-payment-details?payment_id=${paymentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.email && data.contact) {
            handleSubmits(paymentId, data.email, data.contact);
          } else {
            console.error("Email or Contact is missing from API response");
          }
        })
        .catch(error => console.error("Error fetching payment details:", error));
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

  const handleSubmits = async (transactionId,cardemail,cardphone) => {
    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); 
    const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    const formattedExpiryDate = `${expiryDate.getMonth() + 1}/${expiryDate.getDate()}/${expiryDate.getFullYear()}`;
    try {
      const emailPrefix = cardemail.split('@')[0]; 
      const name = emailPrefix.replace(/[^a-zA-Z0-9]/g, ' ')
            .split(' ')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
        var user= {
          name:name,
          email:cardemail, 
          password:'62AAa662626',
          address:'',
          address2:'', 
          country_id:'', 
          mobile:cardphone, 
          company:'',
          transaction_id:transactionId,
          status:1,
        };
        const res =await axios.post(`${ BACKEND_URL }api/users/direct`, user);
        dispatch(setCredentials({ ...res.data }));
        navigate("/");
        toast.success("Payment successfully completed ");
        var templateParamss = {
            name: name,
            email: cardemail,
            date:formattedCurrentDate,
            expiry_date:formattedExpiryDate,
            amount_paid:'74.95',
            transaction_id:transactionId, 
        };
        await axios.post(`${BACKEND_URL}api/mailer/send-payment-mail`, templateParamss);
        
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
  return (
    <div>
      <Helmet>
        <title>{pricingData?.seo_title || "Pricing Page"}</title>
        <meta name="description" content={pricingData?.seo_description || "Discover our affordable pricing plans tailored to meet your needs."} />
        <meta name="keywords" content={pricingData?.seo_keywords || "pricing, plans, subscription, palm oil industry"} />
      </Helmet>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <section className="bg-white py-10">
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
                    {userInfo ? 
                      <Link className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link> :
                      <Link className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link> 
                    }  
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
                    {userInfo ? (
                      userInfo.company ? (
                        <Link onClick={handlePayment} className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link>
                        ) : (
                          <Link to="/subscribe" className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link>
                      )
                    ) : (
                      <Link onClick={handlePayment} className="block text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-200">Get Started</Link>
                    )}        
                  </div>
                  
                </div>
              </div>
            )}
          </div>
        </div>
        
      </section>
    </div>
  );
};

export default PricingScreens;
