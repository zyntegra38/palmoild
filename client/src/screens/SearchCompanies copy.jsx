import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { BACKEND_URL } from '../constans';
import '../css/spinner.css';
import buttonimage from '../images/download.png';
import twitr from '../images/twitter.png';
import fb from '../images/fb.png';
import linkedn from '../images/link.png';
import insta from '../images/insta.png';
import { Helmet } from 'react-helmet';
import { Tooltip } from 'react-tooltip'

const SearchCompanies = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isFavoriteCompany, setIsFavoriteCompany] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [featuredCompanies, setFeaturedcompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCompanies(currentPage);
    handleSearch(searchTerm, selectedCategories, selectedCountries,currentPage);
  }, [userInfo.status,currentPage]); 

  const fetchCompanies = async (page) => {
    try { 
      const featureresponse = await axios.get(`${ BACKEND_URL }api/companies/featuredlist`);
      setFeaturedcompanies(featureresponse.data);      
      const cat_response = await axios.get(`${ BACKEND_URL }api/categories`);
      setCategories(cat_response.data);
      const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
      setCountries(countriesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);    
  };

  const downloadSearchResultsAsExcel = async () => {
    try {
      const data = companies.map((company, index) => ({
        Company: company.company,
        Category: company.categoryName,
        Mobile: company.mobile,
        Country: company.countryName,
        Website: company.website,
        Address:company.address,
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Search Results');
      XLSX.writeFile(workbook, 'palmoilSearch.xlsx');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };
  
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === '') { 
      await handleSearch('', selectedCategories, selectedCountries,currentPage); 
    } else {
      await handleSearch(value, selectedCategories, selectedCountries,currentPage);
    }
  };
  

  const handleSearch = async (searchTerm, selectedCategories, selectedCountries,page) => {
    try {
      let url = `${ BACKEND_URL }api/companies/search`;
      const params = new URLSearchParams();      
      params.append('term', searchTerm);
      params.append('category_id', selectedCategories.join(','));
      params.append('country_id', selectedCountries.join(','));
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
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        const response = await axios.get(`${ BACKEND_URL }api/favorites/check/${selectedCompany._id}/${userInfo._id}`);
        const result = response.data.isFavorite;
        setIsFavoriteCompany(result === "favorite");
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
  
    if (selectedCompany) {
      checkIsFavorite();
    }
  }, [selectedCompany, userInfo]);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };
  

  const handleAddRemoveFavorite = async () => {
    try {
      if (isFavoriteCompany) {
        await axios.delete(`${ BACKEND_URL }api/favorites/delete/${selectedCompany._id}/${userInfo._id}`);
      } else {
        await axios.post(`${ BACKEND_URL }api/favorites/add/${selectedCompany._id}/${userInfo._id}`);
      }
      setIsFavoriteCompany(!isFavoriteCompany);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    if (categoryId === "All") {
      if (selectedCategories.length === categories.length) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(categories.map(category => category._id));
      }
      await handleSearch(searchTerm, selectedCategories, selectedCountries,currentPage);
    } else {
      const updatedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      setSelectedCategories(updatedCategories);
      await handleSearch(searchTerm, updatedCategories, selectedCountries,currentPage);
    }    
  }; 
    
  const handleCountryChange = async (countryId) => {
    if (countryId === "All") {
      if (selectedCountries.length === countries.length) {
        setSelectedCountries([]);
      } else {
        setSelectedCountries(countries.map(country => country._id));
      }
      await handleSearch(searchTerm, selectedCategories, selectedCountries,currentPage);
    } else {
      const updatedCountries = selectedCountries.includes(countryId)
        ? selectedCountries.filter(id => id !== countryId)
        : [...selectedCountries, countryId];
      setSelectedCountries(updatedCountries);
      await handleSearch(searchTerm, selectedCategories, updatedCountries,currentPage);
    }      
  };

  return (
    <div>
      <Helmet>
          <title>PalmOil Directory</title>
          <meta name="description" content="PalmOil Directory" />
          <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
              speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
              biodiesel,palm biodiesel"/>    
      </Helmet>
      <div className="desktop-1 pt-7 respons_search">
        <div className="row">
          <div className="w-3/12 pr-3.5">
            <h4 className="font-raleway mb-3.5 text-lg font-semibold text-gray-600">Refine Your Results</h4>
          </div>
          <div className="w-9/12 px-4 search pr-0">          
            <input 
              className="text-sm px-2.5 py-2 mb-2 text-gray-400 border border-gray-400 w-9/12 rounded-sm font-lato search-box"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Products, Companies"
              disabled
              data-tooltip-id="search-tooltip"
              data-tooltip-content="Please subscribe"
            />
            <Tooltip id="search-tooltip" className="TooltipSubscribe" />
            <span className="w-3/12 text-right inline-block"><i className="icon-email2"></i>
            <button 
              className="bg-lime-500 text-white text-sm px-5 mx-1 py-2 border border-lime-500 hover:bg-green-500 rounded" 
              disabled onClick={() => handleSearch(searchTerm, selectedCategories, selectedCountries,currentPage)}
              data-tooltip-id="search-tooltip"
              data-tooltip-content="Please subscribe">
              Search
            </button>
            <button 
              data-tooltip-id="search-tooltip"
              data-tooltip-content="Please subscribe"
              disabled 
              className="let bg-slate-50 text-sm mx-1 px-5 py-2 text-gray-800 border border-gray-200 rounded hover:text-gray-500" 
              onClick={downloadSearchResultsAsExcel}>
                <img src={buttonimage} alt="download" /> Export</button></span>
          </div>
        </div>
        
        <div className="row listing row-tab">
          <div className="w-3/12 pr-3.5"> 
            <div className="mb-4 max-h-96 overflow-y-auto">
            <div className="mb-2" key="AllCategories">
                <input
                  className="py-1 w-4 inline-block text-sm mr-2"
                  type="checkbox"
                  id="AllCategories"
                  name="AllCategories"
                  data-tooltip-id="search-tooltip"
                  data-tooltip-content="Please subscribe"              
                  disabled 
                  checked={selectedCategories.length === categories.length}
                  onChange={() => handleCategoryChange("All")} />
                <label
                  className="ml-2 text-gray-600 ml-2 font-lato text-sm tracking-wider font-semibold"
                  htmlFor="AllCategories" >
                  All Categories
                </label>
              </div>
              {categories.map((category) => (
                <div className="mb-2" key={category._id}>
                  <input
                    className="py-1  w-4 inline-block text-sm mr-2"
                    type="checkbox"
                    id={category._id}
                    name={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                    data-tooltip-id="search-tooltip"
                    data-tooltip-content="Please subscribe"              
                    disabled               
                  />
                  <label
                    className="text-gray-500 ml-2 ml-2 font-lato text-sm tracking-widest"
                    htmlFor={category._id} >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
            <label className="block text-gray-700 text-lg mb-2 font-raleway">
                <b>Countries:</b>
            </label>
            <div className="mb-4 max-h-96 overflow-y-auto">              
              <div className="mb-2" key="AllCountries">
                <input className="py-1  w-4 inline-block text-sm mr-2" 
                  data-tooltip-id="search-tooltip"
                  data-tooltip-content="Please subscribe"                  
                  disabled 
                  type="checkbox" 
                  id="AllCountries" 
                  name="AllCountries" 
                  checked={selectedCountries.length === countries.length}
                  onChange={() => handleCountryChange("All")}
                />
                <label className="text-gray-500 ml-2 font-lato text-sm tracking-wider" htmlFor="AllCountries">All Countries</label>
              </div>
              {countries.map((country) => (
                <div className="mb-2" key={country._id}>
                  <input 
                    data-tooltip-id="search-tooltip"
                    data-tooltip-content="Please subscribe"                    
                    disabled                   
                    className="py-1  w-4 inline-block text-sm mr-2" 
                    type="checkbox" 
                    id={country._id} 
                    name={country._id}
                    checked={selectedCountries.includes(country._id)}
                    onChange={() => handleCountryChange(country._id)}
                  />
                  <label className="text-gray-500 ml-2 ml-2 font-lato text-sm tracking-wider" htmlFor={country._id}>{country.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="w-9/12 px-4 pr-0">
            <div className="favourites-container relative">
              <h4 className="text-lg z-10 mt-2 relative featured-companies font-raleway mb-2  font-semibold text-gray-600 bg-white pr-1.5 inline-block">Featured Companies</h4>
              <div className="row-tab listing featured from-white bg-gradient-to-r from-white to-green-300 border border-slate-500">
                {Array.isArray(featuredCompanies) && featuredCompanies.length > 0 ? (
                  <>
                      {featuredCompanies.map((featured, index) => (
                        <div key={featured._id} className="border-b-1 border-l-4 p-3 m-1.5 mb-3 ml-0 border-gray-400">
                          <div className="w-8/12 inline-block">
                            <div className="relative">
                              <div className="white_">
                                <h3 className="font-lato text-black font-bold">
                                  <button className="text-md font-lato text-gray-900 font-semibold hover:underline " onClick={() => handleCompanyClick(featured)}>
                                      {featured.company}
                                  </button></h3>
                              </div>
                            </div>
                          </div>
                          <div className="w-4/12 inline-block text-right">
                              <div className="brown">
                                  <h3 className="text-md font-lato font-semibold text-gray-900">Featured</h3>
                              </div>
                          </div>
                        </div> 
                      ))}
                  </>
                ) : (
                    <p></p>
                )}  
              </div>
            </div>   
            {loading ? (
              <div className="spinner"></div> 
            ) : (
              <>
                {Array.isArray(companies) && companies.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-6">
                      {companies.map((company, index) => (
                        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative">
                          <button className="absolute top-2 right-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-500 hover:text-red-500"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M20.84 4.61c-.55-.54-1.32-.87-2.12-.87-1.54 0-2.87 1.08-3.38 2.63h-1.9c-.5-1.55-1.84-2.63-3.38-2.63-.8 0-1.57.33-2.12.87-.6.6-.88 1.42-.88 2.25 0 3.88 6.63 8.3 7.5 8.84.11.08.23.12.36.12s.25-.04.36-.12c.87-.54 7.5-4.96 7.5-8.84 0-.83-.28-1.65-.88-2.25z"
                                />
                            </svg>
                        </button>
                        <img
                            src={company.logo} width="80px" height="40px"
                            alt="Logo"
                            className="mb-4"
                        />
                        {index < 10 ?
                          <>
                          <h4 className="text-lg font-medium text-center" onClick={() => handleCompanyClick(company)}>{company.company}</h4>
                          <span className="text-sm font-medium text-center">{company.categoryName}</span>
                          <button className="bg-green-600 text-white px-6 py-2 rounded-full mt-4" onClick={() => handleCompanyClick(company)}>
                            More info
                          </button>
                          </>:
                          <>
                          <Tooltip id="search-tooltips" className="TooltipSubscribe" />
                          <h4 className="text-lg font-medium text-center"
                            data-tooltip-id="search-tooltips"
                            data-tooltip-content="Please subscribe"                                      
                            disabled  >{company.company}</h4>
                          <span className="text-sm font-medium text-center">{company.categoryName}</span>
                          <button className="bg-green-600 text-white px-6 py-2 rounded-full mt-4" 
                            onClick={() => handleCompanyClick(company)}>
                            More info
                          </button>
                          </>
                          }
                        
                    </div>
                  ))}
                </div>
                    <div data-tooltip-id="search-tooltip"
                         data-tooltip-content="Please subscribe">
                        {totalPages > 1 && (
                          <ReactPaginate
                              pageCount={totalPages} 
                              pageRangeDisplayed={5} 
                              marginPagesDisplayed={2}
                              containerClassName={'pagination'}
                          />
                        )}
                    </div>
                  </>
                ) : (
                  !loading && <div className="font-lato text-sm text-gray-700 pt-10">No results found. Try a different search.</div>
                )}
              </>
            )}  
          </div>
        </div>              
      </div>

      {selectedCompany && (
        <section className="selectedCompany-modal">
          <div className="modal fade in z-30">
            <div className="modal-dialog bg-white p-5 z-50">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" onClick={closeModal} className="close">×</button>
                </div>
                <div className="modal-body">
                  <div className="simple-div">
                    <h4 className="bd-setails block text-gray-700 text-lg mb-2 font-raleway">{selectedCompany.company}</h4>
                    <div className="add-details">
                      <table className="table table-striped">
                        <tbody>
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Category</td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.categoryName}</td>
                          </tr>
                          {typeof selectedCompany.address === 'string' && selectedCompany.address.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Address</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.address}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Country</td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.countryName}</td>
                          </tr>
                          {typeof selectedCompany.website === 'string' && selectedCompany.website.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Website</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.website}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Profile</td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm">
                              <div 
                                dangerouslySetInnerHTML={{
                                  __html: selectedCompany.profile
                                    .replace(/\n/g, '<br />')  
                                    .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length)) 
                                }}
                              ></div>
                            </td>
                          </tr>
                          {typeof selectedCompany.mobile === 'string' && selectedCompany.mobile.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">
                                <h6 className="text-gray-500 ml-2 ml-2 font-lato text-sm "><b>Mobile</b></h6>
                              </td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm "><a href={`tel:${selectedCompany.mobile}`}>{selectedCompany.mobile}</a></td>
                            </tr>
                          )}
                          {(typeof selectedCompany.email === 'string' && selectedCompany.email.trim() !== '')||(typeof email === 'string' && email.trim() !== '') && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">
                              <h6 className="text-gray-500 ml-2 ml-2 font-lato text-sm "><b>Email</b></h6></td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm "><a href={`mailto:${email}`}>{email}</a>{selectedCompany.email} </td>
                            </tr>
                          )}
                          <tr colSpan="2" className="social_buttons">
                            <td colSpan="2"><ul>
                              {typeof selectedCompany.twitter_url === 'string' && selectedCompany.twitter_url.trim() !== '' && (
                                <li className="image_sec text-gray-500 ml-2 ml-2 font-lato text-sm "><a target="_blank" href={selectedCompany.twitter_url}><img src={twitr} alt="twitter" /></a></li>
                              )}
                              {typeof selectedCompany.facebook_url === 'string' && selectedCompany.facebook_url.trim() !== '' && (
                                <li className="image_sec text-gray-500 ml-2 ml-2 font-lato text-sm "><a target="_blank" href={selectedCompany.facebook_url}><img src={fb} alt="facebook" /> </a></li>
                              )}
                              {typeof selectedCompany.linkedin_url === 'string' && selectedCompany.linkedin_url.trim() !== '' && (
                                <li className="image_sec text-gray-500 ml-2 ml-2 font-lato text-sm "><a target="_blank" href={selectedCompany.linkedin_url}><img src={linkedn} alt="linkedin" /></a></li>
                              )}
                              {typeof selectedCompany.insta_url === 'string' && selectedCompany.insta_url.trim() !== '' && (
                                <li className="image_sec text-gray-500 ml-2 ml-2 font-lato text-sm "><a target="_blank" href={selectedCompany.insta_url}><img src={insta} alt="instagram" /> </a></li>
                              )}
                            </ul></td>
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                            <Tooltip id="search-tooltips" className="TooltipSubscribe" />
                            <td className="float-right">
                              <span><button className="btn btn-success font-lato text-sm" 
                                      data-tooltip-id="search-tooltips"
                                      data-tooltip-content="Please subscribe"                                      
                                      disabled >Send Mail</button></span>
                              <span><button className="btn btn-primary font-lato text-sm" 
                                      data-tooltip-id="search-tooltips"
                                      data-tooltip-content="Please subscribe"                                      
                                      disabled >{isFavoriteCompany ? 'Remove from Favorites' : 'Add to Favorites'}</button></span>
                              <span><button className="btn btn-danger font-lato text-sm" onClick={closeModal} data-dismiss="modal">Close</button></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchCompanies;

