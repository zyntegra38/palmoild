import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from "../constans";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogList = () => {
  const [blogData, setBlogData] = useState([]);
  const [blogid, setBlogId] = useState();
  const [blogFormData, setBlogFormData] = useState({
    id: '',
    blog_title: '',
    blog_url:'',
    blog_content:'',
    seo_title:'',
    seo_description: '',
    seo_keywords:'',
    blog_image:'',
    status:'',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlogFormData((prevFormData) => {
        const formDataCopy = { ...prevFormData };
        formDataCopy.blog_image = file; 
        return formDataCopy;
    });
  };

  const fetchBlog = async () => {
    try {
        const response = await axios.get(`${ BACKEND_URL }api/blogdata`);
        setBlogData(response.data);
    } catch (error) {
        console.error('Error fetching blog:', error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const formDataToSend = new FormData();            
        for (const key in blogFormData) {
            formDataToSend.append(key, blogFormData[key]);
        }
        await axios.post(`${ BACKEND_URL }api/blogdata`, formDataToSend);
        closeBlogpopup();
        fetchBlog();         
        toast.success('Blog added successfully!');
    } catch (error) {
        toast.error('Error adding blog');
    }
  };

  const handleUpdateBlog = (blog) => {
    setBlogFormData(prevState => ({
        ...prevState,
        id: blog._id,
        blog_title: blog.blog_title,
        blog_url: blog.blog_url,
        seo_title: blog.seo_title,
        seo_description: blog.seo_description,
        seo_keywords: blog.seo_keywords,
        status: blog.status,
    }));
    openBlogupdatepopup();
  };

  const handleUpdateBlogContet = (blog) => {
    setBlogId(blog._id);
    setBlogFormData(prevState => ({
        ...prevState,
        id:blog._id,
        blog_content: blog.blog_content,
    }));
    openBlogContentupdatepopup();
  };

  const handleUpdateBlogData = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(blogFormData).forEach(key => {
        if (key === 'blog_image' && blogFormData[key] instanceof File) {
          formDataToSend.append(key, blogFormData[key]);
        } 
        else if (blogFormData[key] !== undefined && blogFormData[key] !== '') {
          formDataToSend.append(key, blogFormData[key]);
        }
      });
      await axios.put(`${BACKEND_URL}api/blogdata/${blogFormData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      fetchBlog();
      closeupdateBlogpopup();
      toast.success('Blog updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error updating blog');
    }
  };
  

  const handleUpdateBlogContentData = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${ BACKEND_URL }api/blogdata/${blogid}`, {
        blog_content: blogFormData.blog_content,
      });
      fetchBlog();
      closeBlogContentpopup();
      toast.success('Blog updated successfully!');
    } catch (error) {
      toast.error('Error updating blog');
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');    
        if (confirmDelete) {
          await axios.delete(`${ BACKEND_URL }api/blogdata/${id}`);
          fetchBlog(); 
        }        
        toast.success('Blog Deleted successfully!');
    } catch (error) {
        toast.error('Error deleting blog');
    }
  };  

  const openBlogpopup = () => {
    const popup = document.getElementById("categorypopup");
    popup.classList.toggle("show");
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };

  const openBlogupdatepopup = () => {
    const popup = document.getElementById("categoryupdatepopup");
    popup.classList.toggle("show");
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };

  const openBlogContentupdatepopup = () => {
    const popup = document.getElementById("categorycontentpopup");
    popup.classList.toggle("show");
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };

  const closeBlogpopup = () => {
    setBlogFormData({    
      id:'',  
      blog_title: '', 
      blog_url:'', 
      blog_content:'', 
      seo_title:'', 
      seo_description: '', 
      seo_keywords:'',
      status:'' 
    });
    document.querySelector('.categorypopup').classList.remove('show');    
  };

  const closeBlogContentpopup = () => {
    setBlogFormData({    
      id:'',  
      blog_title: '', 
      blog_url:'', 
      blog_content:'', 
      seo_title:'', 
      seo_description: '', 
      seo_keywords:'',
      status:'' 
    });
    document.querySelector('.categorycontentpopup').classList.remove('show');    
  };

  const closeupdateBlogpopup = () => {
    setBlogFormData({    
      id:'',  
      blog_title: '', 
      blog_url:'', 
      blog_content:'', 
      seo_title:'', 
      seo_description: '', 
      seo_keywords:'',
      status:'' 
    });
    document.querySelector('.categoryupdatepopup').classList.remove('show');    
  };

  const handleDropdownChange = (e) => {
    setBlogFormData({ ...blogFormData, status: e.target.value });
  };

  return (
    <div>
      <div className="relative block w-3/4 px-10 mb-5 mt-5 text-right">        
        <button className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded inline-block" onClick={openBlogpopup}>
          Create Blog
        </button> 
      </div>
      <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
        <div className="table-responsive">
          <table className="mt-4 w-3/4 text-left">
            <thead>
              <tr>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Blog Title</th>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Blog Url</th>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogData.map((blog) => (
                <tr key={blog._id}>
                  <td className="font-lato text-gray-600 text-sm p-2">{blog.blog_title}</td>
                  <td className="font-lato text-gray-600 text-sm p-2">{blog.blog_url}</td>
                  <td className="font-lato text-gray-600 text-sm p-2">
                    <button
                      onClick={() => handleUpdateBlog(blog)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleUpdateBlogContet(blog)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline">
                      Edit Content
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className="categorypopup" id="categorypopup">
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <button onClick={closeBlogpopup} 
            className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"> X </button>
          <div>
            <h3 className="font-bold text-2xl">Add Blog</h3>
          </div>	  
          <div className="mt-10">
            <form className="bg-white" onSubmit={handleFormSubmit}>              
              <div className="mb-4">
                <label htmlFor="blog_title" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog title:
                </label>
                <input
                  type="text"
                  id="blog_title"
                  name="blog_title"
                  value={blogFormData.blog_title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, blog_title:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Content:
                </label>
                <ReactQuill
                  id="blog_content"
                  name="blog_content"
                  theme="snow"
                  value={blogFormData.blog_content}
                  required
                  onChange={(content) => setBlogFormData({ ...blogFormData, blog_content: content })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Url:
                </label>
                <input
                  type="text"
                  id="blog_url"
                  name="blog_url"
                  value={blogFormData.blog_url}
                  onChange={(e) => setBlogFormData({ ...blogFormData, blog_url:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Image:
                </label>
                <input
                  type="file" 
                  id="blog_image"
                  name="blog_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Title:
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={blogFormData.seo_title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, seo_title: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="seo_description" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Description:
                </label>
                <textarea 
                  id="seo_description"
                  name="seo_description"
                  value={blogFormData.seo_description}
                  onChange={(e) => setBlogFormData({ ...blogFormData, seo_description: e.target.value })}
                  required
                  className="shadow appearance-none border rounded w-full h-20 pl-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
              <div className="mb-4">
                <label htmlFor="seo_keywords" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Keywords:
                </label>
                <textarea 
                  id="seo_keywords"
                  name="seo_keywords"
                  value={blogFormData.seo_keywords}
                  onChange={(e) => setBlogFormData({ ...blogFormData, seo_keywords: e.target.value })}
                  className="shadow appearance-none border rounded w-full h-15 pl-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={blogFormData.status}
                  onChange={handleDropdownChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required>
                  <option value="1">Enabled</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Blog
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="categoryupdatepopup" id="categoryupdatepopup">
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <button onClick={closeupdateBlogpopup} 
            className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"> X </button>
          <div>
            <h3 className="font-bold text-2xl">Update Blog</h3>
          </div>	  
          <div className="mt-10">
            <form className="bg-white" onSubmit={handleUpdateBlogData}>              
              <div className="mb-4">
                <label htmlFor="blog_title" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog title:
                </label>
                <input
                  type="hidden"
                  id="id"
                  name="id"
                  value={blogFormData.id}
                  onChange={(e) => setBlogFormData({ ...blogFormData, id:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                <input
                  type="text"
                  id="blog_title"
                  name="blog_title"
                  value={blogFormData.blog_title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, blog_title:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Url:
                </label>
                <input
                  type="text"
                  id="blog_url"
                  name="blog_url"
                  value={blogFormData.blog_url}
                  onChange={(e) => setBlogFormData({ ...blogFormData, blog_url:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="blog_image" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Image:
                </label>
                <input
                  type="file"
                  id="blog_image"
                  name="blog_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Title:
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={blogFormData.seo_title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, seo_title: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="seo_description" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Description:
                </label>
                <textarea 
                  id="seo_description"
                  name="seo_description"
                  value={blogFormData.seo_description}
                  onChange={(e) => setBlogFormData({ ...blogFormData, seo_description: e.target.value })}
                  className="shadow appearance-none border rounded w-full h-20 pl-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="seo_keywords" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Keywords:
                </label>
                <textarea 
                  id="seo_keywords"
                  name="seo_keywords"
                  value={blogFormData.seo_keywords}
                  onChange={(e) => setBlogFormData({ ...blogFormData, seo_keywords: e.target.value })}
                  className="shadow appearance-none border rounded w-full h-20 pl-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={blogFormData.status}
                  onChange={handleDropdownChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required>
                  <option value="1">Enabled</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update Blog
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="categorycontentpopup" id="categorycontentpopup">
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <button onClick={closeBlogContentpopup} 
            className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"> X </button>
          <div>
            <h3 className="font-bold text-2xl">Update Blog</h3>
          </div>	  
          <div className="mt-10">
            <form className="bg-white" onSubmit={handleUpdateBlogContentData}> 
              <div className="mb-4">
                <label htmlFor="blog_url" className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Content:
                </label>
                <input
                  type="hidden"
                  id="id"
                  name="id"
                  value={blogid}
                  onChange={(e) => setBlogFormData({ ...blogFormData, id:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                <ReactQuill
                  id="blog_content"
                  name="blog_content"
                  theme="snow"
                  value={blogFormData.blog_content}
                  onChange={(content) => setBlogFormData({ ...blogFormData, blog_content: content })}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update Blog
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;