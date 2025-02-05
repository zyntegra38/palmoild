import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { BACKEND_URL } from "../constans";


const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Default page to 0
    const [itemsPerPage] = useState(20); // Number of items per page
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`${ BACKEND_URL }api/countries`);
            setCountries(response.data);
            setLoading(false); 
        } catch (error) {
            console.error('Error fetching countries:', error);
            setLoading(false); 
        }
    };

    // Logic to handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Calculate the index of the first and last item to display
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCountries = countries.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='body-content'>
            <h1 className="country-list">Country List</h1>
            {loading ? (
                <div className="spinner"></div> 
            ) : (
                <>
                    {Array.isArray(currentCountries) && currentCountries.length > 0 ? (
                        <>
                            {currentCountries.map((country, index) => (
                                <div className="row listing">
                                    <div className="col-md-12">
                                        <div className="first_top">
                                            <span className="floater singe">{index+1 + (currentPage* itemsPerPage)}</span>
                                            <div className="white_">
                                                <h3><b key={country._id}>
                                                <Link to={`/countries/${country.name}`}>{country.name}</Link>
                                                </b></h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {countries.length > itemsPerPage && (
                                <ReactPaginate
                                    pageCount={Math.ceil(countries.length / itemsPerPage)}
                                    pageRangeDisplayed={5} // Number of pages to display
                                    marginPagesDisplayed={2} // Number of pages to display for margin
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                />
                            )}
                        </>
                    ) : (
                        <p></p>
                    )}
                </>
            )}
        </div>
    );
};

export default CountryList;
