import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from "../constans";

const SiteScreen = () => {
  const [sites, setSites] = useState([]);
  const [siteFormData, setSiteFormData] = useState({
    id: '', 
    name: '',
  });
  const fetchSites = async () => {
    try {
      const response = await axios.get(`${ BACKEND_URL }api/sites`);
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();  
    try {
      await axios.post(`${ BACKEND_URL }api/sites`, siteFormData); 
      fetchSites();
      closeSitePopup();
      setSiteFormData({ name: '' }); 
      toast.success('Site added successfully!');
    } catch (error) {
      toast.error('Error adding site');
    }
  };  

  const handleDeleteSite = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this site?');    
      if (confirmDelete) {
        await axios.delete(`${ BACKEND_URL }api/sites/${id}`);
        fetchSites();  
        toast.success('Site Deleted successfully!');
      }
    } catch (error) {
      toast.error('Error deleting site');
    }
  };
  const openSitePopup = () => {
    const popup = document.getElementById("sitepopup");
    popup.classList.toggle("show");
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };

  const closeSitePopup = () => {
    setSiteFormData({id:'', name: '' });
    document.querySelector('.sitepopup').classList.remove('show');
  };  

  const handleUpdateSite = (site) => {
    setSiteFormData({
      id: site._id,
      name: site.name,
    });
    openSitePopup();
  };
 
  const handleUpdateSiteData = async (e) => {
    e.preventDefault(); 
    try {
      await axios.put(`${ BACKEND_URL }api/sites/${siteFormData.id}`, {
        name: siteFormData.name,
      });
      fetchSites();  
      closeSitePopup();
      setSiteFormData({ id: '', name: '' }); 
      toast.success('Site updated successfully!');
    } catch (error) {
      toast.error('Error updating site');
    }
  }; 

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="relative block w-3/4 justify-center px-10 mb-5 mt-5 items-center text-right">        
        <button className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded" onClick={openSitePopup}>
          Create Site
        </button>
      </div>
      <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
        <div className="table-responsive">
          <table className="mt-4 w-3/4">
            <thead>
              <tr>
                <th scope="col" className="font-lato text-white bg-green-500 text-sm p-2 text-left">Site Name</th>
                <th scope="col" className="font-lato text-white bg-green-500 text-sm p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site._id}>
                  <td className="p-2 text-gray-800 font-lato text-sm">{site.name}</td>
                  <td className="p-2 text-right">
                    <button onClick={() => handleUpdateSite(site)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-raleway px-3 py-1.5 text-sm py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSite(site._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-raleway px-3 py-1.5 text-sm rounded focus:outline-none focus:shadow-outline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className="sitepopup" id="sitepopup">
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <button
            className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
            onClick={closeSitePopup} > X
          </button>
          <div>
            <h3 className="font-bold text-2xl">
              {siteFormData.id ? 'Edit Site' : 'Create Site'}
            </h3>
          </div>
          <div className="mt-10">
            <form className="bg-white" onSubmit={siteFormData.id ? handleUpdateSiteData : handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Site Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={siteFormData.name}
                  onChange={(e) => setSiteFormData({ ...siteFormData, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {siteFormData.id ? 'Update Site' : 'Add Site'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SiteScreen;
