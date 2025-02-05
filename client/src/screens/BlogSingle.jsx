import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom'; 

const LazyLoadingSpinner = () => (
    <div className="spinner"></div>
  );

  
const BlogSingle = () =>{
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { key } = useParams();

    const fetchBlogData = async (key) => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/blogdata/${key}`);
            setBlogData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blog data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogData(key);
    }, [key]);

    return (
        <div>
          <Helmet>
            <title>{blogData?.blog_title || ""}</title>
            <meta name="description" content={blogData?.seo_description || ""} />
            <meta name="Keywords" content={blogData?.seo_keywords || ""} />
          </Helmet>
          <section className="bg-white py-8" id="about">
            <div className="container max-w-5xl mx-auto">
              <h2 className="font-bold text-2xl text-center font-raleway">
                {blogData?.blog_title || ""}
              </h2>
              <div className="w-full mb-4">
                <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
              </div>
              {loading ? (
                <LazyLoadingSpinner />
              ) : (
                <div>
                    {blogData.blog_image ? 
                        <img 
                            src={blogData.blog_image}
                            alt={blogData.blog_title} 
                            className="w-full h-100 object-cover rounded-lg shadow-md mb-6"
                        /> 
                    :''}
                    <div 
                    className="text-justify text-gray-600 mb-8 px-5"
                    dangerouslySetInnerHTML={{ __html: blogData?.blog_content || "" }}
                    />
                </div>
              )}
            </div>
          </section>  
        </div>
    );

}
export default BlogSingle;