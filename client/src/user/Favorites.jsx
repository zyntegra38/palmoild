import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import '../css/spinner.css'
import { Helmet } from 'react-helmet';

const LazyLoadingSpinner = () => (
  <div className="spinner"></div>
);

const Favorites = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Define fetchCompanies outside of useEffect
    const fetchCompanies = async () => {
        try {
            const response = await fetch(`${ BACKEND_URL }api/favorites/${userInfo._id}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCompanies(data);
                setLoading(false);
            } else {
                console.error('Expected an array but received:', data);
                setCompanies([]);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            setCompanies([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo.status === 0) {
            navigate('/subscribe');
        }
        fetchCompanies();
    }, [userInfo.status]);

    const handleRemoveFavorite = async (Companyid) => {
        try {
            await axios.delete(`${ BACKEND_URL }api/favorites/delete/${Companyid}/${userInfo._id}`);
            fetchCompanies();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Favorites PalmOil Directory</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>  
            </Helmet>
            {loading ? (
                <LazyLoadingSpinner />
            ) : (
                <>
                    {Array.isArray(companies) && companies.length > 0 ? (
                        <>
                            <section className="bg-white relative block md:w-full justify-center px-10 mb-5 mt-5 items-center row">
                                <div className="container mx-auto my-0 table-responsive">
                                    <h2 className="text-ds text-gray-600 mb-10 font-lato mt-8 font-semibold">My Favourites</h2>
                                    <table className="mt-4 w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">Company</th>
                                                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">Contact Name</th>
                                                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">Email</th>
                                                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">Category</th>
                                                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">Country</th>
                                                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companies.map((company, index) => (
                                                <tr key={company._id} className="">
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.company}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.staff_mobiles.slice(1)}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.staff_emails.slice(1)}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.categoryName}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.countryName}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">
                                                        <button onClick={() => handleRemoveFavorite(company._id)}
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            <section className="bg-white py-8" >
                                <div className="container max-w-5xl mx-auto">
                                    <h2 className="font-bold text-2xl text-center font-raleway">
                                        No favorite companies found.
                                    </h2>
                                    <div className="w-full mb-4">
                                        <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
                                        <div className="text-gray-600 mb-8 mt-5 px-5 text-center">
                                        <p>Add companies to your Favorites from the Companies Search section.</p>
                                        <Link className="italic font-bold" to="/search">Go to Search</Link>
                                        </div>
                                    </div>
                                </div>
                            </section> 
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Favorites;
