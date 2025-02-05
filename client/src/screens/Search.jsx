import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import emailjs from '@emailjs/browser';
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
import { ToastContainer, toast } from 'react-toastify';

const Search = () => {
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
  const [email, setemail] = useState('');
  const [companyname, setCompany] = useState('');

  const [validationErrors, setValidationErrors] = useState({
    to_email: '',
    subject:'',
    profile:''
  });  

  const validateForm = () => {
    let isValid = true;
    if (!FormData.to_email.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        to_email: 'Email name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        to_email: '',
      }));
    }
    if (!FormData.subject.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        subject: 'subject name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        subject: '',
      }));
    }
    if (!FormData.profile.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        profile: 'Message name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        profile: '',
      }));
    }
    return isValid;
  };

  const [FormData, setFormData] = useState({
    to_email:'',
    profile: '', 
    subject: '',
  });

  useEffect(() => {
    if (userInfo.role === 1) {
      navigate('/');
    } else if (userInfo.status === 0) {
      navigate('/search-companies');
    }else{
      navigate('/search');
    }
    fetchCompanies(currentPage);
    handleSearch(searchTerm, selectedCategories, selectedCountries,currentPage);
  }, [userInfo.status,currentPage]); 

  const fetchContact = async (companyId) => { 
      try { 
          const featureresponse = await axios.get(`${BACKEND_URL}api/staff/${companyId}`);
          if (featureresponse.data.length > 0) {
              const emails = featureresponse.data.map(item => item.email);
              const emailsString = emails.join(', ');
              setemail(emailsString);
          } else {
              setemail(null); 
          }      
      } catch (error) {
          setLoading(false);
      }
  };

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
      XLSX.writeFile(workbook, 'PalmOil_Directory.xlsx');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };
  
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === '') { 
      await handleSearch('', selectedCategories, selectedCountries,1); 
    } else {
      await handleSearch(value, selectedCategories, selectedCountries,1);
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
    fetchContact(company._id); 
    setSelectedCompany(company);
    setCompany(company.company);
};

  const closeModal = () => {
    setSelectedCompany(null);
    setemail(null);
  };
  
  const sendmail = () =>{
    setSelectedCompany(null); 
    const popup = document.getElementById("mailpopmeup");
    popup.classList.toggle("show");
  }
  const closePopup = () => {
    document.querySelector('.mailpopmeup').classList.remove('show');
    setFormData({ to_email:'', profile: '',  subject: ''});
  };

  const emailSendClient = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    try {
      var templateParams = {
          to_email: FormData.to_email,
          from_email: userInfo.email,
          subject: FormData.subject,
          profile: FormData.profile,
      };
      emailjs.init('7K6FgornqEudFEBY8');
      emailjs.send('service_n3h3why', 'template_94c4nzr', templateParams).then(
          (response) => {
              toast.success('Email successfully sent');
          },
          (error) => {
              toast.error('Failed to send reset email to the email address.');
          },
      );
      closePopup();
    } catch (err) {
      toast.error(err?.data?.message || err.error);         
    }
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
      await handleSearch(searchTerm, selectedCategories, selectedCountries,1);
    } else {
      const updatedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      setSelectedCategories(updatedCategories);
      await handleSearch(searchTerm, updatedCategories, selectedCountries,1);
    }    
  }; 
    
  const handleCountryChange = async (countryId) => {
    if (countryId === "All") {
      if (selectedCountries.length === countries.length) {
        setSelectedCountries([]);
      } else {
        setSelectedCountries(countries.map(country => country._id));
      }
      await handleSearch(searchTerm, selectedCategories, selectedCountries,1);
    } else {
      const updatedCountries = selectedCountries.includes(countryId)
        ? selectedCountries.filter(id => id !== countryId)
        : [...selectedCountries, countryId];
      setSelectedCountries(updatedCountries);
      await handleSearch(searchTerm, selectedCategories, updatedCountries,1);
    }      
  };

  return (
    <div style={{ display: userInfo.status === 0 ? 'none' : 'block' }}>
      <Helmet>
        <title>PalmOil Directory</title>
        <meta name="description" content="PalmOil Directory" />
        <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
            speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
            biodiesel,palm biodiesel"/>    
      </Helmet>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="desktop-1 pt-7 respons_search">
        <div className="row">
          <div className="w-3/12 pr-3.5">
            <h4 className="font-raleway mb-3.5 text-lg font-semibold text-gray-600">Refine Your Results</h4>
          </div>
          <div className="w-9/12 px-4 search pr-0">          
            <input 
              className="text-sm px-2.5 py-2 mb-2 text-gray-400 border border-gray-400 w-9/12 rounded-sm font-lato"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Products, Companies" />
            <span className="w-3/12 text-right inline-block"><i className="icon-email2"></i><button 
              className="bg-lime-500 text-white text-sm px-5 mx-1 py-2 border border-lime-500 hover:bg-green-500 rounded" 
              onClick={() => handleSearch(searchTerm, selectedCategories, selectedCountries,1)}>
              Search
            </button>
            <button className="let bg-slate-50 text-sm mx-1 px-5 py-2 text-gray-800 border border-gray-200 rounded hover:text-gray-500" onClick={downloadSearchResultsAsExcel}><img src={buttonimage} alt="download" /> Export</button></span>
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
                  checked={selectedCategories.length === categories.length}
                  onChange={() => handleCategoryChange("All")}
                />
                <label
                  className="ml-2 text-gray-600 ml-2 font-lato text-sm tracking-wider font-semibold"
                  htmlFor="AllCategories"
                >
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
                  />
                  <label
                    className="text-gray-500 ml-2 ml-2 font-lato text-sm tracking-widest"
                    htmlFor={category._id}
                  >
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
                  <input className="py-1  w-4 inline-block text-sm mr-2" type="checkbox" id={country._id} name={country._id}
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
                    {companies.map((company, index) => (
                      <div className="listing row-tab" key={company._id}>
                        <div className="w-8/12 inline-block">
                          <div className="first_top">
                            <div className="white_ p-2.5">
                              <h3>
                                <b>
                                  <button className="font-lato hover:underline text-gray-600 text-sm" onClick={() => handleCompanyClick(company)}>
                                    {company.company}
                                  </button>
                                </b>
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className="w-4/12 inline-block text-right">
                          <div className="second_left"></div>
                          <div className="brown">
                            <h3 className="font-lato hover:underline text-gray-600 text-sm">{company.categoryName}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                    {totalPages > 1 && (
                        <ReactPaginate
                            pageCount={totalPages} 
                            pageRangeDisplayed={5} 
                            marginPagesDisplayed={2} 
                            onPageChange={handlePageChange}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                        />
                    )}
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
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.profile}</td>
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
                            <td className="float-right text-center">
                              <span><button className="btn btn-success font-lato text-sm mt-2 mb-3" onClick={sendmail}>Send Mail</button></span>
                              <span><button className="btn btn-primary font-lato text-sm mt-2 mb-3" onClick={handleAddRemoveFavorite}>{isFavoriteCompany ? 'Remove from Favorites' : 'Add to Favorites'}</button></span>
                              <span><button className="btn btn-danger font-lato text-sm mt-2 mb-3" onClick={closeModal} data-dismiss="modal">Close</button></span>
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

        <section className="mailpopmeup" id="mailpopmeup">
          <div className="relative bg-white w-5/12 mx-auto p-8 md:p-12 my-10  shadow-2xl">
            <button
                className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
                onClick={closePopup} > X 
            </button>
            <div>
              <h3 className="font-bold text-2xl text-center font-raleway">{companyname}</h3>
            </div>
            <div className="mt-10">
              <form className="flex flex-col flex-respn" onSubmit={emailSendClient}>
                  <div className="mb-2 pt-3 flex">
                      <div className='pl-5'>From: {userInfo.email}</div>
                  </div>
                  <div className="mb-2 pt-3 flex">
                    <select
                        name="to_email"
                        id="to_email"
                        value={FormData.to_email}
                        onChange={(e) => setFormData({ ...FormData, to_email: e.target.value })}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5"
                    >
                        <option value=''>select email</option>
                        {email && email.split(',').map((emailItem, index) => (
                            <option key={index} value={emailItem.trim()}>{emailItem.trim()}</option>
                        ))}
                    </select>
                    {validationErrors.to_email && <p className="text-red-500 text-xs italic">{validationErrors.to_email}</p>}
                  </div>
                  <div className="mb-2 pt-3 flex">
                      <input
                        name="subject"
                        type="text"
                        id="subject"
                        placeholder='Subject'
                        value={FormData.subject}
                        onChange={(e) => setFormData({ ...FormData, subject: e.target.value })}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5" />
                        {validationErrors.subject && <p className="text-red-500 text-xs italic">{validationErrors.subject}</p>}
                  </div>
                  <div className="mb-5 pt-3 flex">
                      <textarea
                        id="profile"
                        name="profile"
                        placeholder='Message'
                        value={FormData.profile}
                        onChange={(e) => setFormData({ ...FormData, profile: e.target.value })}
                        className="w-full rounded border h-20 px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5" />
                      {validationErrors.profile && <p className="text-red-500 text-xs italic">{validationErrors.profile}</p>}
                  </div>
                  <button className="mx-5 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200" type="submit">
                  Send Inquiry Now
                  </button>
              </form>
            </div>
          </div>
        </section>
    </div>
  );
};

export default Search;

