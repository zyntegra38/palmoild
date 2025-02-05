import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const ContactScreen = () => {
  const [contactData, setContactData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContactData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/contact`);
      setContactData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cancellation data:', error);
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchContactData();
  }, []); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}api/mailer/send-contact-mail`, formData);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <div>
      <Helmet>
          <title>{contactData?.seo_title || "Contact Us"}</title>
          <meta name="description" content={contactData?.seo_description || ""} />
          <meta name="Keywords" content={contactData?.seo_keywords || ""} />
      </Helmet>
      <section className="bg-white py-8" id="about">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
            Contact Us
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          {loading ? (
            <LazyLoadingSpinner />
          ) : (
            <>
              {submitted ? (
                <p className="text-green-500 text-center">Thank you for contacting us! We will get back to you soon.</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full inline-block px-3 pr-4 pb-4">
                      <input 
                        id="name" type="text" placeholder="Your Name" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                    </div>
                    <div className="w-full inline-block px-3 pr-4 pb-4">
                      <input 
                        id="email" type="email" placeholder="Your Email" name="email" value={formData.email} onChange={handleChange} required 
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                    </div>
                    <div className="w-full inline-block px-3 pr-4 pb-4">
                      <input 
                        id="subject" type="text" placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} required 
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                    </div>
                    <div className="w-full inline-block px-3 pr-4 pb-4">
                      <textarea 
                        id="message" placeholder="Your Message" name="message" value={formData.message} onChange={handleChange} required 
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button className="w-4/12 text-raleway text-sm bg-green-600 mb-10 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"> Submit </button>
                  </div>
                </form>
              )}
            </>
          )}
          {contactData ? (
            <div>              
              <div 
                className="text-justify text-gray-600 mb-8 px-5"
                dangerouslySetInnerHTML={{ __html: contactData.cms_content }}
              />
            </div>
          ) : (
            <div className="text-justify text-gray-600 mb-8 px-5">
              <p>Zyntegra Solutions Pvt. Ltd,</p>
              <p>8th Floor, Infra Futura, Seaport - Airport Rd.,</p>
              <p>Opp. Bharat Matha College, Kakkanad,</p>
              <p>Kerala, India - 682021.</p>
              <p className='pt-6 pb-6'>Phone: +91 9995198718 </p>
              <p>For all your enquiries, please contact : Email: info@palmoildirectory.com</p>
            </div>
          )}
        </div>
      </section>	
    </div>
  );
};

export default ContactScreen;
