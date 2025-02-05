import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { BACKEND_URL } from "../constans";
import '../css/spinner.css'

const CountrySingle = () => {
    const { countryName } = useParams();
    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(20); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${ BACKEND_URL }api/countries/${countryName}`);
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
    
        fetchCompanies();
    }, [countryName]);
    

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='body-content'>
            {loading ? (
                <div className="spinner"></div> 
            ) : (
                <>
                    {Array.isArray(currentCompanies) && currentCompanies.length > 0 ? (
                        <>
                            {currentCompanies.map((company, index) => (
                                <div className="row listing row-tab">
                                    <div className="col-md-8">
                                        <div className="first_top">
                                            <span className="floater">{index+1 + (currentPage* itemsPerPage)}</span>
                                            <div className="white_">
                                                <h3><b key={company._id}>
                                                <Link to={`/companies/${company.company_slug}`}>{company.name}</Link>
                                                </b></h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="second_left"></div>
                                        <div className="brown">
                                            <h3><b>{company.categoryName}</b></h3> {/* Use categoryName instead of category_id */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {companies.length > itemsPerPage && (
                                <ReactPaginate
                                    pageCount={Math.ceil(companies.length / itemsPerPage)}
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
                </>
            )};
        </div>
    );
};

export default CountrySingle;
