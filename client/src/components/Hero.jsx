import { useEffect, useState, useCallback} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import plseed_img from '../images/plseed.png';
import vlo_img from '../images/vlo.jpg';
import traders_img from '../images/traders.png';
import plantations from '../images/plantations.png';
import refiners from '../images/refiners.png';
import equipment from '../images/equipment.png';
import oleochemical from '../images/oleochemical.png';
import crude_oil from '../images/crude-oil.png';
import refined_oil from '../images/refined-oil.png';
import shipping from '../images/shipping.png';
import payment from '../images/payment.png'
import suppliers from '../images/suppliers.png';
import gurantee from '../images/gurantee.png';
import MPOA from '../images/MPOA.png';
import MPOB from '../images/MPOB.png';
import MPOC from '../images/MPOC.png';
import Felda from '../images/Felda.png';
import { BACKEND_URL } from '../constans';
import { Helmet } from 'react-helmet';
import axios from 'axios';


const defaultCmsContent = {
    'home-text-1': 'Largest Marketplace of companies in Palm Oil Industry. Buyers, Sellers, Traders, Brokers, Plantations, Organizations from around the world.',
    'home-text-2': '1 Year Subscription to Palmoildirectory.com <br/> - Only $74.95!',
    'home-sub-text-1': 'The PalmOil Directory is the most comprehensive directory of the PalmOil industry. With 6000+ participating companies from 100+ countries worldwide, the directory contains profiles of plantations, traders, brokers, millers, refiners, exporters, buyers, oleochemicals, food manufacturers, non-food manufacturers, logistics providers, equipment manufacturers, plantation suppliers, biodiesel, banks/investors , market reports, surveyors, consultants and associations.',
    'home-sub-text-2': '1-year access to the website.',
    'home-sub-text-3': 'More than 6000 company listings and references of traders, buyers , biodiesel, exporters, plantations, suppliers,equipment suppliers or services.',
    'home-sub-text-4': 'Organizations and government agencies throughout the world.',
};
  
const HomeScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categoriesWithCompanies, setCategoriesWithCompanies] = useState([]);
    const [cmsContent, setCmsContent] = useState(defaultCmsContent);
    
    const fetchData = useCallback(async () => {
        try {
            const [responseCms, responseCategories] = await Promise.all([
                axios.get(`${BACKEND_URL}api/cmsdata/all`),
                fetch(`${BACKEND_URL}api/categories/categories-companies`),
              ]);
        
              const cmsData = responseCms.data.reduce((acc, item) => {
                acc[item.cms_key] = item.cms_content;
                return acc;
              }, {});
              setCmsContent(cmsData);

              const data = await responseCategories.json();
              setCategoriesWithCompanies(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } 
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const profileParam = urlParams.get('profile');
        const message = urlParams.get('message');
        if (profileParam) {
            const profile = JSON.parse(decodeURIComponent(profileParam));
            dispatch(setCredentials({ ...profile }));
            navigate("/subscribe");
        }
        if (message) {
            navigate("/");
            toast.error("User already exists with this same email id");
        }        
    }, [dispatch, navigate]);

    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Helmet>
                <title>PalmOil Directory</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>    
            </Helmet>
            <div className="bg-cream">
                <div className="max-w-screen-xl px-8 mx-auto flex flex-col lg:flex-row items-start">
                    <div className="flex flex-col w-full lg:w-6/12 justify-center lg:pt-12 items-start text-center lg:text-left mb-5 md:mb-0">
                        <h1 data-aos="fade-right" data-aos-once="true" className="my-4 text-5xl font-bold leading-tight text-darken aos-init aos-animate">
                            <span className="text-yellow-500">PalmOil</span> Directory
                        </h1>

                        <p data-aos="fade-down" data-aos-once="true" data-aos-delay="300" className="leading-normal text-2xl mb-8 aos-init aos-animate"
                            dangerouslySetInnerHTML={{ __html: cmsContent['home-text-1'] }}  />

                        {userInfo ? (
                            userInfo.status === 0 ? (
                            <>
                                <div data-aos="fade-up" data-aos-once="true" data-aos-delay="700" className="w-full md:flex items-center justify-center lg:justify-start md:space-x-5 aos-init aos-animate">
                                    <button className="rounded lg:mx-0 bg-yellow-500 text-white font-bold py-2 px-4 focus:outline-none transform transition hover:scale-102 duration-300 ease-in-out">
                                        <Link to='/subscribe'>CLICK HERE FOR INSTANT ACCESS</Link>   
                                    </button>
                                </div>
                                <div className="flex items-center text-center space-x-3 py-3 focus:outline-none transform transition hover:text-gray-800 ease-in-out">
                                    <span className="cursor-pointer" dangerouslySetInnerHTML={{ __html: cmsContent['home-text-2'] }} />
                                </div>
                            </>
                            ) : null
                        ) : (
                            <>
                                <div data-aos="fade-up" data-aos-once="true" data-aos-delay="700" className="w-full md:flex items-center justify-center lg:justify-start md:space-x-5 aos-init aos-animate">
                                    <button className="rounded lg:mx-0 bg-yellow-500 text-white font-bold py-2 px-4 focus:outline-none transform transition hover:scale-102 duration-300 ease-in-out">
                                        <Link to='/register'>CLICK HERE FOR INSTANT ACCESS</Link>
                                    </button>
                                </div>
                                <div className="flex items-center text-center space-x-3 py-3 focus:outline-none transform transition hover:text-gray-800 ease-in-out">
                                    <span className="cursor-pointer" dangerouslySetInnerHTML={{ __html: cmsContent['home-text-2'] }} />
                                </div>
                            </>
                        )} 
                        <div className='w-full md:flex items-center justify-center lg:justify-start md:space-x-5 aos-init aos-animate'>
                            <div className="flex items-center text-center space-x-3 mt-5 md:mt-0 focus:outline-none transform transition hover:text-gray-800 ease-in-out">
                                <img className="payment_icons" src={payment} alt="Palmoildirectory Payment methods." />
                                <img className="gurantee" src={gurantee} alt="Palmoildirectory 100% safe and secure with guarantee" />
                            </div> 
                        </div> 
                        <div className="flex items-center text-center space-x-3 mt-5 focus:outline-none transform transition hover:text-gray-800 ease-in-out">
                            Trusted by Industry Leaders Worldwide
                        </div> 
                        <div className="flex items-center text-center space-x-3 mt-2 focus:outline-none transform transition hover:text-gray-800 ease-in-out">
                            <div className="slider-container">
                                <div className="slider">
                                    <img className="client_icon" src={MPOA} alt="Palmoildirectory Trusted MPOA Industry"/>
                                    <img className="client_icon" src={MPOB} alt="Palmoildirectory Trusted MPOB Industry" />
                                    <img className="client_icon" src={MPOC} alt="Palmoildirectory Trusted MPOC Industry" />
                                    <img className="client_icon" src={Felda} alt="Palmoildirectory Trusted Felda Industry" />
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="w-full lg:w-6/12 relative" id="girl">
                        <img data-aos="fade-up" data-aos-once="true" className="w-10/12 mx-auto 2xl:-mb-20 floating-4 aos-init aos-animate" src={plseed_img} alt="Palm Seed" />
                    </div>
                </div>
            </div>
            <div className="images- absolute w-full -mt-12 lg:-mt-24">
                <svg viewBox="0 0 1428 174" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ background: '#f2f2f2' }}>
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(-2.000000, 44.000000)" fill="#FFFFFF" fillRule="nonzero">
                            <path d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496" opacity="0.100000001"></path>
                            <path d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z" opacity="0.100000001"></path>
                            <path d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z" id="Path-4" opacity="0.200000003"></path>
                        </g>
                        <g transform="translate(-4.000000, 76.000000)" fill="#FFFFFF" fillRule="nonzero">
                            <path d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"></path>
                        </g>
                    </g>
                </svg>
            </div>
            <div className="container px-4 lg:px-8 mx-auto mb-5 max-w-screen-xl text-gray-700 overflow-x-hidden lg:overflow-x-visible">
                <div className="p-5">
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-4">
                        <div className="grid grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative"
                            >
                                <button className="absolute top-2 right-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6 text-gray-500 hover:text-red-500"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.84 4.61c-.55-.54-1.32-.87-2.12-.87-1.54 0-2.87 1.08-3.38 2.63h-1.9c-.5-1.55-1.84-2.63-3.38-2.63-.8 0-1.57.33-2.12.87-.6.6-.88 1.42-.88 2.25 0 3.88 6.63 8.3 7.5 8.84.11.08.23.12.36.12s.25-.04.36-.12c.87-.54 7.5-4.96 7.5-8.84 0-.83-.28-1.65-.88-2.25z"
                                    />
                                </svg>
                                </button>
                                <img
                                src="./FGV IFFCO SDN BHD15_logo.jpg"
                                alt="Logo"
                                className="mb-4"
                                />
                                <h4 className="text-lg font-medium text-center">
                                FGV IFFCO SDN BHD
                                </h4>
                                <button className="bg-black text-white px-6 py-2 rounded-full mt-4">
                                More info
                                </button>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>
                <div className="md:flex mt-10 md:space-x-10 items-start">
                
                    <div data-aos="fade-down" className="md:w-5/12 relative aos-init aos-animate">
                        <div style={{ background: '#33EFA0' }} className="w-32 h-32 rounded-full absolute z-0 left-4 -top-12 animate-pulse"></div>
                        <div style={{ background: '#33D9EF' }} className="w-5 h-5 rounded-full absolute z-0 left-36 -top-12 animate-ping"></div>
                        <div className="frames h-96 overflow-hidden">
                            <img className="floating" src={vlo_img} alt="Palmoildirectory Palm Field"/>
                            {/* <div className='mt-10'>
                                <p>Frequently Asked Questions</p>
                                <p>Is This A Subscription?</p>
                                <p>No - This a one time payment, no further payments necessary.</p>
                            </div> */}
                        </div>
                        
                        <div style={{ background: '#5B61EB' }} className="w-32 h-32 rounded-full absolute z-0 right-0 -bottom-10 animate-pulse"></div>
                        <div style={{ background: '#F56666' }} className="w-5 h-5 rounded-full absolute z-0 right-52 -bottom-10 animate-ping"></div>
                    </div>

                    <div data-aos="fade-down" className="md:w-7/12 mt-20 md:mt-0 text-gray-500 aos-init aos-animate">
                        <h1 className="text-2xl font-semibold text-darken lg:pr-40"><span className="text-yellow-500">PalmOil </span> Directory</h1>
                        <div className="flex items-center space-x-5 my-5">
                            <div className="flex-shrink bg-white shadow-lg rounded-full p-3 flex items-center justify-center">
                                <svg className="w-4 h-4" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="11.8182" height="11.8182" rx="2" fill="#2F327D"></rect>
                                    <rect y="14.1816" width="11.8182" height="11.8182" rx="2" fill="#2F327D"></rect>
                                    <rect x="14.7727" width="11.8182" height="11.8182" rx="2" fill="#2F327D"></rect>
                                    <rect x="14.7727" y="14.1816" width="11.8182" height="11.8182" rx="2" fill="#F48C06"></rect>
                                </svg>
                            </div>
                            <p  dangerouslySetInnerHTML={{ __html: cmsContent['home-sub-text-1'] }} />
                        </div>
                        <div className="flex items-center space-x-5 my-5">
                            <div className="flex-shrink bg-white shadow-lg rounded-full p-3 flex items-center justify-center">
                                <svg className="w-4 h-4" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="8" y="6" width="20" height="20" rx="2" fill="#2F327D"></rect>
                                    <rect width="21.2245" height="21.2245" rx="2" fill="#F48C06"></rect>
                                </svg>
                            </div>
                            <p  dangerouslySetInnerHTML={{ __html: cmsContent['home-sub-text-2'] }} />
                        </div>
                        <div className="flex items-center space-x-5 my-5">
                            <div className="flex-shrink bg-white shadow-lg rounded-full p-3 flex items-center justify-center">
                                <svg className="w-4 h-4" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 11.375C6.15469 11.375 7.5 9.91758 7.5 8.125C7.5 6.33242 6.15469 4.875 4.5 4.875C2.84531 4.875 1.5 6.33242 1.5 8.125C1.5 9.91758 2.84531 11.375 4.5 11.375ZM25.5 11.375C27.1547 11.375 28.5 9.91758 28.5 8.125C28.5 6.33242 27.1547 4.875 25.5 4.875C23.8453 4.875 22.5 6.33242 22.5 8.125C22.5 9.91758 23.8453 11.375 25.5 11.375ZM27 13H24C23.175 13 22.4297 13.3605 21.8859 13.9445C23.775 15.0668 25.1156 17.093 25.4062 19.5H28.5C29.3297 19.5 30 18.7738 30 17.875V16.25C30 14.4574 28.6547 13 27 13ZM15 13C17.9016 13 20.25 10.4559 20.25 7.3125C20.25 4.16914 17.9016 1.625 15 1.625C12.0984 1.625 9.75 4.16914 9.75 7.3125C9.75 10.4559 12.0984 13 15 13ZM18.6 14.625H18.2109C17.2359 15.1328 16.1531 15.4375 15 15.4375C13.8469 15.4375 12.7688 15.1328 11.7891 14.625H11.4C8.41875 14.625 6 17.2453 6 20.475V21.9375C6 23.2832 7.00781 24.375 8.25 24.375H21.75C22.9922 24.375 24 23.2832 24 21.9375V20.475C24 17.2453 21.5812 14.625 18.6 14.625ZM8.11406 13.9445C7.57031 13.3605 6.825 13 6 13H3C1.34531 13 0 14.4574 0 16.25V17.875C0 18.7738 0.670312 19.5 1.5 19.5H4.58906C4.88438 17.093 6.225 15.0668 8.11406 13.9445Z" fill="#2F327D"></path>
                                </svg>
                            </div>
                            <p  dangerouslySetInnerHTML={{ __html: cmsContent['home-sub-text-3'] }} />
                        </div>
                        <div className="flex items-center space-x-5 my-5">
                            <div className="flex-shrink bg-white shadow-lg rounded-full p-3 flex items-center justify-center">
                                <svg className="w-4 h-4" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 11.375C6.15469 11.375 7.5 9.91758 7.5 8.125C7.5 6.33242 6.15469 4.875 4.5 4.875C2.84531 4.875 1.5 6.33242 1.5 8.125C1.5 9.91758 2.84531 11.375 4.5 11.375ZM25.5 11.375C27.1547 11.375 28.5 9.91758 28.5 8.125C28.5 6.33242 27.1547 4.875 25.5 4.875C23.8453 4.875 22.5 6.33242 22.5 8.125C22.5 9.91758 23.8453 11.375 25.5 11.375ZM27 13H24C23.175 13 22.4297 13.3605 21.8859 13.9445C23.775 15.0668 25.1156 17.093 25.4062 19.5H28.5C29.3297 19.5 30 18.7738 30 17.875V16.25C30 14.4574 28.6547 13 27 13ZM15 13C17.9016 13 20.25 10.4559 20.25 7.3125C20.25 4.16914 17.9016 1.625 15 1.625C12.0984 1.625 9.75 4.16914 9.75 7.3125C9.75 10.4559 12.0984 13 15 13ZM18.6 14.625H18.2109C17.2359 15.1328 16.1531 15.4375 15 15.4375C13.8469 15.4375 12.7688 15.1328 11.7891 14.625H11.4C8.41875 14.625 6 17.2453 6 20.475V21.9375C6 23.2832 7.00781 24.375 8.25 24.375H21.75C22.9922 24.375 24 23.2832 24 21.9375V20.475C24 17.2453 21.5812 14.625 18.6 14.625ZM8.11406 13.9445C7.57031 13.3605 6.825 13 6 13H3C1.34531 13 0 14.4574 0 16.25V17.875C0 18.7738 0.670312 19.5 1.5 19.5H4.58906C4.88438 17.093 6.225 15.0668 8.11406 13.9445Z" fill="#2F327D"></path>
                                </svg>
                            </div>
                            <p  dangerouslySetInnerHTML={{ __html: cmsContent['home-sub-text-4'] }} />
                        </div>                        
                    </div>
                </div>
                    
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoriesWithCompanies.map((category, index) => (
                        <div key={index} data-aos="fade-down" className="container-02 aos-init">
                            <div className="glassmorphic-card" data-tilt data-tilt-glare>
                                <div className="imgBox">
                                    <img src={getImageForCategory(category.category)} style={{ width: '50%', margin: 'auto' }}  alt={`Palmoildirectory ${category.category}`} />
                                </div>
                                <div className="contentBox T1">
                                    <div>
                                        <h3>{category.category}</h3>
                                        <ul>
                                            {category.companies.map((company, index) => (
                                                <li key={index}>
                                                    <Link to={`${company.company_slug}`}>
                                                        {company.company.length > 26 ? `${company.company.slice(0, 26)}...` : company.company}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Link className="viewal" to={`c/${category.slug}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default HomeScreen
const getImageForCategory = (category) => {
    switch (category) {
        case 'Traders':
            return traders_img;
        case 'Plantations':
            return plantations;
        case 'Refiners':
            return refiners;
        case 'Equipment manufacturers':
            return equipment;
        case 'Oleochemicals':
            return oleochemical;
        case 'Crude Palm Oil':
            return crude_oil;
        case 'Red Palm Oil':
            return refined_oil;
        case 'Shipping Logistics':
            return shipping;
        case 'Plantation Suppliers':
            return suppliers;
        default:
            return null;
    }
};