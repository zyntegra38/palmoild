import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';
import PaymentPopupBox from '../components/PaymentPopupBox';

const LazyLoadingSpinner = () => (
    <div className="spinner"></div>
);

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [featuredCompanies, setFeaturedcompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [itemsPerPage] = useState(50); 
    const { userInfo } = useSelector((state) => state.auth);
    const [showPopmeup, setShowPopmeup] = useState(false);    
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async (page) => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/companies/normaluser`, {
                params: { page, perPage: itemsPerPage }
            });
            const data = response.data; 
            setCompanies(data.companies);
            setTotalPages(data.totalPages);
            const cat_response = await axios.get(`${BACKEND_URL}api/categories`);
            setCategories(cat_response.data);
            setLoading(false);
            const featureresponse = await axios.get(`${BACKEND_URL}api/companies/featuredlist`);
            setFeaturedcompanies(featureresponse.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setLoading(false);
        }
    };

    useEffect(() => {             
        fetchCompanies(currentPage);
    }, [currentPage]);   

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
            <Helmet>
                <title>PalmOil Directory</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>    
            </Helmet>
            <div className="desktop-1 ">
                <div className="desktop-1-child"></div>    
                {loading ? (
                    <LazyLoadingSpinner />
                ) : (  
                    <>    
                    <div className="row listing row-tab">                    
                        <div className="w-3/12"> 
                            <label className="block text-gray-600 text-lg mb-5 font-raleway ">
                                <b>Categories:</b>
                            </label>
                            <div className="mb-4">              
                                {categories.map((category) => (
                                    <div className="" key={category._id}>
                                        <Link to={`/c/${category.slug}`} >
                                            <label className="font-lato text-gray-600 text-sm">{category.name}</label>
                                        </Link>                  
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-9/12">
                            <div className="relative mb-6">
                                <div className="row-tab listing featured">
                                    {Array.isArray(featuredCompanies) && featuredCompanies.length > 0 ? (
                                        <>
                                            {featuredCompanies.map((featured, index) => (
                                                <div key={featured._id} className="p-4 flex items-center from-white bg-gradient-to-r from-white to-green-200">
                                                <div className="w-8/12 inline-block">
                                                <div className="relative">
                                                    <div className="featr">
                                                        {userInfo ? (
                                                            <Link className="text-gray-600 font-lato text-sm" to={`/${featured.company_slug}`}>{featured.company}</Link>
                                                        ) :(
                                                            <Link className="text-gray-600 font-lato text-sm" to={`/${featured.company_slug}`}>{featured.company}</Link>
                                                        )}                                                 
                                                        <p className="text-gray-600 font-lato text-sm">{featured.mobile}</p>
                                                        <p className="text-gray-600 font-lato text-sm">{featured.email}</p>
                                                        <p className="text-green-600 font-lato text-sm">{featured.website}</p>
                                                    </div>
                                                </div>
                                                </div>
                                                <div className="w-4/12 inline-block text-right">
                                                    <div className="brown">
                                                        <h3 className="font-lato text-white bg-blue-600 text-xs inline-block px-2 py-1 rounded-sm fe">Featured</h3>
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
                            {Array.isArray(companies) && companies.length > 0 ? (
                            <>
                                {companies.map((company, index) => (
                                    <div className="listing row-tab my-1" key={company._id}>
                                        <div className="w-8/12 inline-block">
                                            <div className="first_top">
                                                <div className="white_">
                                                    <h3 className="text-gray-800 text-gray-700 font-lato text-sm">
                                                        {userInfo ? (
                                                            <Link to={`/${company.company_slug}`}>{company.company}</Link>
                                                        ) :(
                                                            <Link to={`/${company.company_slug}`}>{company.company}</Link>
                                                        )}                                                        
                                                    </h3>
                                                </div>
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
                                <p></p>
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
export default CompanyList;