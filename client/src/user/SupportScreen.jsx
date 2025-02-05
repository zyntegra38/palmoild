import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const SupportScreen = () => {
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchSupportData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/support`);
      setSupportData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchSupportData();
  }, []); 

  return (
    <div>
      <Helmet>
          <title>{supportData?.seo_title || "Support"}</title>
          <meta name="description" content={supportData?.seo_description || ""} />
          <meta name="Keywords" content={supportData?.seo_keywords || ""} />
      </Helmet>
      <section className="bg-white py-8" id="support">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
            Support
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          {loading ? (
            <LazyLoadingSpinner />
          ) : (
            <div 
              className="text-justify text-gray-600 mb-8 px-5"
              dangerouslySetInnerHTML={{ __html: supportData?.cms_content || "" }}
            />
          )}
        </div>
      </section> 
    </div>
  );
};

export default SupportScreen;
