import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from "../constans";

const CountryScreen = () => {
  const [FormData, setFormData] = useState({
    id: '', 
    name: '',
  });
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${ BACKEND_URL }api/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${ BACKEND_URL }api/countries`, FormData);
      fetchCountries(); 
      closeCountryPopup();
      setFormData({ name: '' }); 
      toast.success('Country added successfully!');
    } catch (error) {
      toast.error('Error adding country');
    }
  };

  const handleEditCountry = (country) => {
    setFormData({
      id: country._id,
      name: country.name,
    });
    openCountryPopup();
  }; 

  const handleUpdateCountry = async (e) => {
    e.preventDefault(); 
    try {
      await axios.put(`${ BACKEND_URL }api/countries/${FormData.id}`, {
        name: FormData.name,
      });
      fetchCountries();
      closeCountryPopup();
      setFormData({ id: '', name: '' }); 
      toast.success('Country updated successfully!');
    } catch (error) {
      toast.error('Error updating country:', error);
    }
  };  

  const handleDeleteCountry = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this country?');    
      if (confirmDelete) {
        await axios.delete(`${ BACKEND_URL }api/countries/${id}`);
        fetchCountries();  
      }
      toast.success('Country Deleted successfully!');
    } catch (error) {
      toast.error('Error deleting country');
    }
  };

  const openCountryPopup = () => {
    const popup = document.getElementById("countrypopup");
    popup.classList.toggle("show");
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };
  const closeCountryPopup = () => {
    setFormData({id:'', name: '' }); 
    document.querySelector('.countrypopup').classList.remove('show');
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="relative block w-3/4 px-10 mb-5 mt-5 text-right">        
        <button className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded inline-block" onClick={openCountryPopup}>
          Create Country
        </button> 
      </div>
      <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
        <div className="table-responsive">
          <table className="mt-4 w-3/4 text-left">
            <thead>
              <tr>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Country Name</th>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country._id}>
                  <td className="font-lato text-gray-600 text-sm p-2">{country.name}</td>
                  <td className="font-lato text-gray-600 text-sm p-2">
                    <button
                      onClick={() => handleEditCountry(country)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCountry(country._id)}
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
      <section className="countrypopup" id="countrypopup">
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <button className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
            onClick={closeCountryPopup} >  X </button>
          <div>
            <h3 className="font-bold text-2xl">
              {FormData.id ? 'Edit Country' : 'Create Country'}
            </h3>
          </div>
          <div className="mt-10">
            <form className="bg-white" onSubmit={FormData.id ? handleUpdateCountry : handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Country Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={FormData.name}
                  onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {FormData.id ? 'Update Country' : 'Add Country'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryScreen;
