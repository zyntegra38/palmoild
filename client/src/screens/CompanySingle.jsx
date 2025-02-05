import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from "../constans";
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

const CompanySingle = () => {
    const { companyName } = useParams();
    const [company, setCompany] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);

    const fetchCompanyDetails = async (companyName) => {
        try {
            const response = await fetch(`${ BACKEND_URL }api/companies/${companyName}`);
            const data = await response.json();
            setCompany(data);
        } catch (error) {
            console.error('Error fetching company details:', error);
        }
    };

    useEffect(() => {   
        fetchCompanyDetails(companyName);
    }, [companyName]); // Add companyName as a dependency to useEffect
    
    const createdAtDate = company ? new Date(company.date_added) : null;
    const createdAtDateString = createdAtDate ? createdAtDate.toLocaleDateString() : '';

    return (
        <div style={{ display: userInfo.status === 0 ? 'none' : 'block' }}>            
            {company && (
                <>
                <Helmet>
                    <title>PalmOil Directory, {company.company}</title>
                    <meta name="keywords" content={`${company.company}, ${company.categoryName}, palm oil company ${company.countryName},list of palm oil companies in ${company.countryName}`} />
                    <meta name="description" content={`${company.company}, Connect with Palm Oil importers, buyers, suppliers, equipment manufacturers worldwide`} />
                </Helmet>
                <div className="page-content page-container" id="page-content">
                    <div className="padding desktop-1">
                        <div className="row container d-flex justify-content-center">
                            <div className="col-xl-6 col-md-12">
                                <div className="card user-card-full">
                                    <div className="row m-l-0 m-r-0">
                                        <div className="col-sm-12 col-md-4 bg-c-lite-green user-profile">
                                            <div className="card-block text-center text-white">
                                                <div className="m-b-25">
                                                {company.logo && typeof company.logo === 'string' && company.logo.trim() !== '' && (
                                                    <img 
                                                        src={`${BACKEND_URL}uploads/${company.logo}`} 
                                                        width="75px" 
                                                        height="55px" 
                                                        alt="Company Logo" />
                                                )}
                                                </div>
                                                <h5 className="f-w-600">{company.company}</h5>
                                                <p>{company.categoryName}</p>
                                                <a href={company.facebook_url} className="social_"><i className="fa-brands fa-facebook-f"></i></a>
                                                <a href={company.twitter_url} className="social_"><i className="fa-brands fa-x-twitter"></i></a>
                                                <a href={company.linkedin_url} className="social_"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href={company.insta_url} className="social_"><i className="fa-brands fa-instagram"></i></a>
                                                <div className="cnt-code">
                                                    <a className="block text-gray-700 text-2sm mb-2 font-raleway ">Country</a>
                                                    <a className="block text-gray-700 text-2sm mb-2 font-raleway ">{company.countryName}</a>
                                                    <a className="block text-gray-700 text-2sm mb-2 font-raleway ">Member since</a>
                                                    <a className="block text-gray-700 text-2sm mb-2 font-raleway ">{createdAtDateString}</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-8">
                                            <div className="card-block">
                                                <h6 className="text-justify text-gray-600 mb-3 font-lato text-xl">Profile { company.status ? <span className="green flo">Active</span> : <span className="red flo">Inactive</span> }</h6>
                                                <div className="">
                                                    <div className="col-sm-12">
                                                        <p className="block text-gray-700 text-2sm mb-2 font-raleway text-justify">{company.profile}</p>
                                                    </div>
                                                </div>
                                                <h6 className="block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">Information</h6>
                                                <div className="row">
                                                    {company.mobile && (
                                                        <div className="col-sm-6">
                                                            <p className="block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">Phone</p>
                                                            <a className="text-muted block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">{company.mobile}</a>
                                                        </div>
                                                    )}
                                                    {company.sector && (
                                                        <div className="col-sm-6">
                                                            <p className="block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">Sector</p>
                                                            <a className="text-muted block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">{company.sector}</a>
                                                        </div>
                                                    )}
                                                    {company.website && (
                                                        <div className="col-sm-6">
                                                            <p className="block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">Website</p>
                                                            <a href="#" className="text-muted block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">{company.website}</a>
                                                        </div>
                                                    )}
                                                    {company.address && (
                                                        <div className="col-sm-6">
                                                            <p className="block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">Address</p>
                                                            <a className="text-muted block text-gray-700 text-2sm mb-2 font-raleway text-justify font-semibold">{company.address}</a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default CompanySingle;
