import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const PrivacyPolicy = () => {
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrivacyData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/privacy-policy`);
      setPrivacyData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching privacy data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyData();
  }, []); 

  return (
    <div>
      <Helmet>
          <title>{privacyData?.seo_title || "Privacy Policy"}</title>
          <meta name="description" content={privacyData?.seo_description || ""} />
          <meta name="Keywords" content={privacyData?.seo_keywords || ""} />
      </Helmet>
      {loading ? (
        <LazyLoadingSpinner />
      ) : (
        <section className="bg-white py-8" id="about">
          <div className="container max-w-5xl mx-auto">
            <h2 className="font-bold text-2xl text-center font-raleway">
              Privacy Policy
            </h2>
            <div className="w-full mb-4">
              <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
            </div>
            <div 
              className="text-justify text-gray-600 mb-8 px-5"
              dangerouslySetInnerHTML={{ __html: privacyData?.cms_content || "" }}
            />
          </div>
        </section>	
      )}	    
    </div>
  );
};

export default PrivacyPolicy;
