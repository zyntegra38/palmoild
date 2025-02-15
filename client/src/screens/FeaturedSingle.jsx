import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, Globe, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { BACKEND_URL } from "../constans";
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

const FeaturedSingle = () => {
    const { companyName } = useParams(); // Using only companyName to fetch company details
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);

    const fetchCompanyDetails = async (companyName) => {
        try {
            const response = await fetch(`${BACKEND_URL}api/featuredcompanies/${companyName}`);
            const data = await response.json();
            setCompany(data);
            setLoading(false);  // Set loading to false once the data is fetched
        } catch (error) {
            console.error('Error fetching company details:', error);
            setLoading(false);  // Set loading to false if there's an error
        }
    };

    useEffect(() => {
        if (companyName) {
            fetchCompanyDetails(companyName);
        }
    }, [companyName]); // Re-run this effect when companyName changes

    // Handling createdAt date formatting
    const createdAtDate = company ? new Date(company.date_added) : null;
    const createdAtDateString = createdAtDate ? createdAtDate.toLocaleDateString() : '';

    // Loading spinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-yellow-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Handling if no company is found
    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-yellow-50">
                <p className="text-xl text-gray-600">Company not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-50 to-yellow-50 py-12">
            <Helmet>
                <title>{company.company} - Featured Company</title>
                <meta name="description" content={`Details about ${company.company}`} />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
                    <div className="relative h-40 bg-gradient-to-r from-green-500 to-yellow-600">
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 rounded-t-3xl">
                            <div className="flex items-center space-x-6">
                                <img
                                    src={company.logo}
                                    alt={`${company.company} logo`}
                                    className="h-24 bg-white rounded-2xl shadow-xl border-4 border-white transition-transform transform hover:rotate-3"
                                />
                                <div>
                                    <h1 className="text-3xl font-extrabold text-white drop-shadow-md">{company.company}</h1>
                                    <p className="text-green-300 text-md font-semibold mt-1">{company.categoryName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Company Profile</h2>
                            <div className="prose max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{
                                    __html: company.profile
                                        .replace(/\n/g, '<br />')
                                        .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))
                                }} />
                        </div>

                        {/* Team Section */}
                        {/* <div className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Team</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {company.team.map((member) => (
                                    <div key={member.id} className="bg-white rounded-2xl shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg">
                                        <div className="flex flex-col items-center text-center">
                                            <h3 className="text-xl font-semibold text-gray-800 mt-4">{member.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{member.designation}</p>
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Mail className="h-4 w-4 text-green-600" />
                                                    <a href={`mailto:${member.email}`} className="text-sm text-gray-700 hover:text-green-600">
                                                        {member.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Phone className="h-4 w-4 text-green-600" />
                                                    <a href={`tel:${member.mobile}`} className="text-sm text-gray-700 hover:text-green-600">
                                                        {member.mobile}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                {company.address && (
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <MapPin className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                            <p className="mt-1 text-gray-800">{company.address}</p>
                                        </div>
                                    </div>
                                )}

                                {company.mobile && (
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Phone className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                                            <a href={`tel:${company.mobile}`} className="mt-1 text-green-600 hover:text-green-700">
                                                {company.mobile}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.email && (
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Mail className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                            <a href={`mailto:${company.email}`} className="mt-1 text-green-600 hover:text-green-700">
                                                {company.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.website && (
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Globe className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Website</h3>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" 
                                                className="mt-1 text-green-600 hover:text-green-700">
                                                {company.website}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Media Section */}
                        {(company.twitter_url || company.facebook_url || company.linkedin_url || company.insta_url) && (
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Social Media</h2>
                                <div className="flex space-x-6">
                                    {company.twitter_url && (
                                        <a href={company.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                                            <Twitter className="h-8 w-8" />
                                        </a>
                                    )}
                                    {company.facebook_url && (
                                        <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                                            <Facebook className="h-8 w-8" />
                                        </a>
                                    )}
                                    {company.linkedin_url && (
                                        <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                                            <Linkedin className="h-8 w-8" />
                                        </a>
                                    )}
                                    {company.insta_url && (
                                        <a href={company.insta_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                                            <Instagram className="h-8 w-8" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedSingle;
