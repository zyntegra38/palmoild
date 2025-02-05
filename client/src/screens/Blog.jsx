import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

// Loading Spinner component
const LazyLoadingSpinner = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
    <span className="text-gray-600 text-lg">Loading...</span>
  </div>
);

// Blog Component
const Blog = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog data from the API
  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/blogdata`);
      setBlogData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching blog:', error);
    }
  };

  // Fetch blog data on component mount
  useEffect(() => {
    fetchBlog();
  }, []); 

  // Function to truncate content to 100 words
  const truncateContent = (content, wordLimit) => {
    const words = content.split(' ');  // Split content by spaces to get words
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'; // Return first 100 words with ellipsis
    }
    return content; // Return full content if less than 100 words
  };

  return (
    <div className="container mx-auto px-4">
      <Helmet>
        <title>Blog</title>
        <meta name="description" content="List of all blogs" />
      </Helmet>

      {loading ? (
        <LazyLoadingSpinner />
      ) : (
        <section className="py-8">
          <div className="row">
            <div className="w-9/12">
              {blogData.map((blog) => (
                <div key={blog._id} className="mb-12">
                  {blog.blog_image && (
                    <img 
                      src={blog.blog_image}
                      alt={blog.blog_title} 
                      className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
                    />
                  )}
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{blog.blog_title}</h2>
                  <p className="text-gray-700 mb-6" 
                      dangerouslySetInnerHTML={{ __html: truncateContent(blog.blog_content, 60) }} 
                  />
                  <a 
                    href={`blog/${blog.blog_url}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    rel="noopener noreferrer"
                  > 
                    Read More 
                  </a>
                </div>
              ))}
            </div>
            <div className='w-3/12'>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;
