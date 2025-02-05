import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";

const SendEmail = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [formDatas, setFormDatas] = useState({
    emails: '',
    companies: '',
    names: '',
    templateId: '' // New field for selected template
  });
  const [templates, setTemplates] = useState([]); // Store available templates
  const [submitted, setSubmitted] = useState(false);

  // Fetch templates when component mounts
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}api/mailer/templates`);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChanges = (e) => {
    setFormDatas({ ...formDatas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}api/mailer/send-custom-mail`, formData);
      setFormData({
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const handleSubmitMulti = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}api/mailer/send-custom-multimail`, formDatas);
      setFormDatas({
        emails: '',
        companies: '',
        names: '',
        templateId: ''
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <div>
      <section className="bg-white py-8" id="about">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
            Send Mail
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 ">
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
            <span className="text-gray-500 hover:text-gray-900 text-xs">This section allows you to send emails to a specific email address. You can customize the subject and content of the email by filling in the respective fields for the subject and message.</span>
            
            <div className="flex items-center justify-center">
              <button className="w-4/12 text-raleway text-sm bg-green-600 mb-10 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"> Submit </button>
            </div>
          </form>
          <form onSubmit={handleSubmitMulti}>
            <h2 className="font-bold text-2xl text-center font-raleway">
              Send Multiple Mails
            </h2>
            <div className="flex flex-wrap -mx-3">
              {/* New Template Selection Dropdown */}
              <div className="w-full inline-block px-3 pr-4 pb-4">
                <select
                  id="templateId"
                  name="templateId"
                  value={formDatas.templateId}
                  onChange={handleChanges}
                  required
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"
                >
                  <option value="">Select Email Template</option>
                  {templates.map(template => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full inline-block px-3 pr-4 pb-4">
                <textarea 
                  id="emails" placeholder="Your Email List" name="emails" value={formDatas.emails} onChange={handleChanges} required 
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
              </div>
              <div className="w-full inline-block px-3 pr-4 pb-4">
                <textarea 
                  id="names" placeholder="Your Name List" name="names" value={formDatas.names} onChange={handleChanges} required 
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
              </div>
              <div className="w-full inline-block px-3 pr-4 pb-4">
                <textarea 
                  id="companies" placeholder="Your Company List" name="companies" value={formDatas.companies} onChange={handleChanges} required 
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
              </div>
            </div>
            <span className="text-gray-500 hover:text-gray-900 text-xs">
              This section allows you to send emails to multiple email addresses. You can select a template and provide the necessary details by entering email addresses, names, and company names as comma-separated strings in the respective fields: Your Email List, Your Name List, and Your Company List.
            </span>
            <div className="flex items-center justify-center mt-3">
              <button className="w-4/12 text-raleway text-sm bg-green-600 mb-10 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"> Submit </button>
            </div>
          </form>
        </div>
      </section>	
    </div>
  );
};

export default SendEmail;