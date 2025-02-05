import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import PaymentPopupBox from '../components/PaymentPopupBox';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const SubScribeText = () => (
  <>
    <p className="text-gray-700 font-lato text-sm ml-2">
      <Link to={'/register'}><FontAwesomeIcon icon={faLink} /> Click here for instant access to PalmOilDirectory.com</Link> - Largest Marketplace of companies in 
    </p>
    <p className="text-gray-700 font-lato text-sm">Palm Oil Industry.</p>
  </>
);

const CompanySingles = () => {
  const { companyName } = useParams();
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedCompanies, setRelatedCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [relatedeloading, setRELoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const [showPopmeup, setShowPopmeup] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompanyDetails = async (companyName) => {
    try {
      if (companyName.includes('.html')) {
        companyName = companyName.replace('.html', ''); 
      }
      const response = await fetch(`${BACKEND_URL}api/companies/${companyName}`);
      const data = await response.json();
      const cat_response = await axios.get(`${BACKEND_URL}api/categories`);
      setCategories(cat_response.data);
      setLoading(false);
      if (data && !data.error) {
        setCompany(data);        
        fetchRelatedCompanies(data.category_id, data._id, currentPage, itemsPerPage);
      } else {
        setRELoading(false);
      }      
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchRelatedCompanies = async (categoryId, companyId, page, limit) => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/companies/category/${categoryId}/${companyId}`, {
        params: { page, limit }
      });
      const data = response.data; 
      setRelatedCompanies(data.companies);
      setTotalPages(data.totalPages);
    } catch (error) {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails(companyName);
    window.scrollTo(0, 0);
  }, [companyName, currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    window.scrollTo({
        top: 0,
        behavior: "smooth" 
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottomOfPage = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 0.2;
      const thresholdPosition = bottomOfPage * threshold;

      if (scrollPosition >= thresholdPosition) {
        setShowPopmeup(true);
      } else {
        setShowPopmeup(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {company && !company.error && (
        <Helmet>
          <title>PalmOil Directory, {company.company}</title>
          <meta name="keywords" content={`${company.company}, ${company.categoryName}, palm oil company ${company.countryName},list of palm oil companies in ${company.countryName}`} />
          <meta name="description" content={`${company.company}, Connect with Palm Oil importers, buyers, suppliers, equipment manufacturers worldwide`} />
        </Helmet>
      )}
      <div className="desktop-1">
        <div className="desktop-1-child"></div>
          {loading ? (
              <LazyLoadingSpinner />
          ) : (  
            <>
              <div className="row listing row-tab">
                <div className="w-3/12">
                  <label className="block text-gray-600 text-lg mb-2 font-raleway font-semibold">
                    Categories:
                  </label>
                  <div className="mb-4">
                    {categories.map((category) => (
                      <div className="" key={category._id}>
                        <Link to={`/c/${category.slug}`}>
                          <label className="font-lato text-gray-600 text-sm">{category.name}</label>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-9/12 related_lab">
                  {company && (
                    <label className="">
                      <b className="relative featured-companies font-raleway mb-3 text-2xl font-semibold text-gray-600 bg-white pr-1.5 z-10 inline-block">{company.company}</b>
                      {userInfo ? (
                        userInfo.status === 0 ? (
                          <SubScribeText />
                        ) : null
                      ) : (
                        <SubScribeText />
                      )}
                      <p>
                        <b className="relative featured-companies font-raleway mt-3 mb-3 text-lg font-semibold text-gray-600 bg-white pr-1.5 z-10 inline-block">Related Companies</b>
                      </p>
                    </label>
                  )}
                  {Array.isArray(relatedCompanies) && relatedCompanies.length > 0 ? (
                      <>
                      {relatedCompanies.map((company) => (
                          <div className="listing row-tab" key={company._id}>
                          <div className="w-8/12 inline-block">
                              <div className="first_top">
                              <div className="white_">
                                  <h3 className="text-gray-800 text-gray-700 font-lato text-sm my-1">
                                  <Link to={`/${company.company_slug}`}>{company.company}</Link>
                                  </h3>
                              </div>
                              </div>
                          </div>
                          <div className="w-4/12 inline-block">
                              <div className="second_left"></div>
                              <div className="brown">
                              <h3><b>{company.categoryName}</b></h3>
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
                      !relatedeloading && 
                      <div className="font-lato text-sm text-gray-700 pt-10">
                        <h2 className="font-bold text-2xl  font-raleway">
                        No company found with this name 
                        </h2>
                        <div className="w-full mb-4">
                          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
                          <div className="text-gray-600 mb-8 mt-5 px-5 ">
                            <p>Oops! The page you're looking for doesn't exist.</p>
                            <Link className="italic font-bold mt-5" to="/">Go to Home</Link>
                          </div>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </>
          )}
      </div>
      {userInfo ? (
        userInfo.status === 0 ? (
          showPopmeup && <PaymentPopupBox showPopmeup={showPopmeup} setShowPopmeup={setShowPopmeup} />
        ) : null
      ) : (
        <PaymentPopupBox showPopmeup={showPopmeup} setShowPopmeup={setShowPopmeup} />
      )}
    </div>
  );
};

export default CompanySingles;
