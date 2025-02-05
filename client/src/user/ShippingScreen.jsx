import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const Shipping = () => {
  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShippingData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/shipping`);
      setShippingData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shipping data:', error);
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchShippingData();
  }, []); 

  return (
    <div>
      <Helmet>
          <title>{shippingData?.seo_title || "Shipping and Delivery"}</title>
          <meta name="description" content={shippingData?.seo_description || ""} />
          <meta name="Keywords" content={shippingData?.seo_keywords || ""} />
      </Helmet>
      {loading ? (
        <LazyLoadingSpinner />
      ) : (
        <>
          <section className="bg-white py-8" id="about">
            <div className="container max-w-5xl mx-auto">
              <h2 className="font-bold text-2xl text-center font-raleway">
                  Shipping
              </h2>
              <div className="w-full mb-4">
                <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
              </div>
              {shippingData ? (
                <div 
                  className="text-justify text-gray-600 mb-8 px-5"
                  dangerouslySetInnerHTML={{ __html: shippingData.cms_content }}
                />
              ) : (
                <p>No shipping data available.</p>
              )}
            </div>
          </section>	
        </>
      )}	    
    </div>
  );
};
export default Shipping;
