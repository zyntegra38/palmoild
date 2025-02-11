import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from "../constans";

const FeaturedCompanyScreen = () => {
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage] = useState(50);  
    const [companies, setCompanies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCompanies = async (page) => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/featuredcompanies`, {
                params: { page, perPage: itemsPerPage }
            });
            const data = response.data[0]; 
            setCompanies(data.companies);
            setTotalPages(data.totalPages); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCompanies(currentPage);
        handleSearch(searchTerm, '', '',currentPage);
    }, [currentPage]);   
    
    const handleDeleteCompany = async (id) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this company?');
            if (confirmDelete) {
                await axios.delete(`${ BACKEND_URL }api/featuredcompanies/${id}`);
                fetchCompanies(currentPage); 
            }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === '') { 
          await handleSearch('', '', '',1); 
        } else {
          await handleSearch(value, '', '',1);
        }
    };

    const handleSearch = async (searchTerm, selectedCategories, selectedCountries,page) => {
        try {
          let url = `${ BACKEND_URL }api/featuredcompanies/search`;
          const params = new URLSearchParams();      
          params.append('term', searchTerm);
          params.append('category_id', '');
          params.append('country_id', '');
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
          const response = await axios.get(url, {
              params: { page, perPage: itemsPerPage }
          });
          const data = response.data[0]; 
          setCompanies(data.companies);
          setTotalPages(data.totalPages); 
        } catch (error) {
          setLoading(false);
        }
      };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="relative block w-3/4 justify-center px-10 mb-5 mt-2 items-center text-right ">        
                <Link className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded inline-block" to={`/add-featuredcompany`}>Create Company</Link>  
            </div>
            <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center page-centr" >
                <div className="table-responsive">
                    <div className="w-3/4 search pr-0">          
                        <input 
                            className="text-sm px-2.5 py-2 mb-2 text-gray-400 border border-gray-400 w-9/12 rounded-sm font-lato"
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Products, Companies" />
                        <span className="w-4/4 text-right inline-block"><i className="icon-email2"></i>
                            <button 
                                className="bg-lime-500 text-white text-sm px-5 mx-1 py-2 border border-lime-500 hover:bg-green-500 rounded" 
                                onClick={() => handleSearch(searchTerm, '', '',1)}>
                            Search
                            </button>
                        </span>
                    </div>                            
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner"></div> 
                    </div>
                ) : (
                    <>
                        {companies.length > 0 ? (
                            <div className="table-responsive">
                                <table className="mt-4 w-3/4">
                                    <thead>
                                        <tr>
                                            <th className="font-lato text-white bg-green-500 text-sm p-2">No</th>
                                            <th className="font-lato text-white bg-green-500 text-sm p-2">Logo</th>
                                            <th className="font-lato text-white bg-green-500 text-sm p-2">Company Name</th>
                                            <th className="font-lato text-white bg-green-500 text-sm p-2">Category</th>
                                            <th className="font-lato text-white bg-green-500 text-sm p-2">Country</th>
                                            <th className="font-lato text-white bg-green-500 text-sm p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.map((company, index) => (
                                            <tr key={company._id}>
                                                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="p-2">
                                                    {company.logo === '' ? (
                                                        <>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img
                                                                className="font-lato text-gray-600 text-sm p-2"
                                                                src={company.logo}
                                                                width="75px"
                                                                height="55px"
                                                                alt={company.company}
                                                            />
                                                        </>
                                                    )}
                                                </td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.company}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.categoryName}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.countryName}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2 text-center">
                                                    <Link className="font-lato text-sm bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 rounded focus:outline-none focus:shadow-outline md:inline-block"
                                                        to={`/edit-company/${company._id}`}>Edit</Link> 
                                                    <button
                                                        onClick={() => handleDeleteCompany(company._id)}
                                                        className="font-lato text-sm bg-red-500 hover:bg-red-700 text-white py-1.5 ml-1 px-2 rounded focus:outline-none focus:shadow-outline md:inline-block">Delete</button>                               
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='mt-4 w-3/4'>
                                <ReactPaginate
                                    pageCount={totalPages} 
                                    pageRangeDisplayed={5} 
                                    marginPagesDisplayed={2} 
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                    nextLabel={currentPage === totalPages ? null : 'Next'} 
                                    previousLabel={currentPage === 1 ? null : 'Previous'} 
                                />

                                </div>                                
                            </div>
                        ) : (
                            <div className="text-center p-5">No companies found.</div>
                        )}                      
                    </>
                )}        
            </div>
        </div>
    );
};

export default FeaturedCompanyScreen;
