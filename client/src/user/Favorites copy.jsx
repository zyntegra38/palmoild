import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import '../css/spinner.css'

const Favorites = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

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
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [userInfo]);

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
            {loading ? (
                <div className="spinner"></div>
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
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.staff_mobiles}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.staff_emails}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.categoryName}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">{company.countryName}</td>
                                                    <td className="font-lato text-gray-600 text-sm p-2">
                                                        <a className="delete text-red-600" title="Delete" href="#" onClick={() => handleRemoveFavorite(company._id)}>
                                                            *
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    ) : (
                            <p></p>
                        )}
                </>
            )}
        </div>
    );
};

export default Favorites;
