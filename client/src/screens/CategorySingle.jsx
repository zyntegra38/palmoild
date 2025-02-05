import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';
import PaymentPopupBox from '../components/PaymentPopupBox';

const LazyLoadingSpinner = () => (
    <div className="spinner"></div>
);

const CategorySingle = () => {
    const { categoryName } = useParams();
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(50); 
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);
    const [showPopmeup, setShowPopmeup] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCompanies = async (page) => {
        try {
            const response = await fetch(`${BACKEND_URL}api/categories/${categoryName}`, {
                params: { page, perPage: itemsPerPage }
            });
            const data = await response.json();
            setCompanies(data.companies);
            setTotalPages(data.totalPages);
            setLoading(false);
            const Catresponse = await axios.get(`${ BACKEND_URL }api/categories`);
            setCategories(Catresponse.data);
            window.scrollTo(0, 0); 
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {      
        fetchCompanies(currentPage);
    }, [currentPage, categoryName]);
  
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
                <title>PalmOil Directory, {categoryName}</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>    
            </Helmet>
            <div className="desktop-1">
                <div className="desktop-1-child"></div>   
                {loading ? (
                    <LazyLoadingSpinner />
                ) : (  
                    <>      
                        <div className="row listing row-tab">
                            <div className="w-3/12"> 
                                <label className="block text-gray-700 text-lg mb-2 font-raleway  font-semibold">
                                    Categoriess:
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
                                <label className="capitalize relative featured-companies font-raleway mb-1.5 text-2xl font-semibold text-gray-600 bg-white pr-1.5 z-10 inline-block">
                                    {categoryName}
                                </label>
                                {Array.isArray(companies) && companies.length > 0 ? (
                                    <>
                                        {companies.map((company, index) => (
                                            <div className="listing row-tab" key={company._id}>
                                                <div className="w-8/12 inline-block my-1">
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
                                    !loading && <div className="font-lato text-sm text-gray-700 pt-10">No results found.</div>
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

export default CategorySingle;
