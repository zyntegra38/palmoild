import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const AboutScreen = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/about`);
      setAboutData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>{aboutData?.seo_title || "About Us"}</title>
        <meta name="description" content={aboutData?.seo_description || ""} />
        <meta name="Keywords" content={aboutData?.seo_keywords || ""} />
      </Helmet>
      <section className="bg-white py-8" id="about">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
            About Us
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          {loading ? (
            <LazyLoadingSpinner />
          ) : (
            <div 
              className="text-justify text-gray-600 mb-8 px-5"
              dangerouslySetInnerHTML={{ __html: aboutData?.cms_content || "" }}
            />
          )}
        </div>
      </section>  
    </div>
  );
};

export default AboutScreen;
