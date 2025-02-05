import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import paymentbg from '../images/subscribe.png';
import { useSelector } from "react-redux";
import cards from '../images/cards.png';
import { BACKEND_URL } from '../constans';

const PaymentPopupBox = ({ showPopmeup, setShowPopmeup }) => {
    const [subscribeData, setSubscribeData] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    const fetchSubscribeData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/cmsdata/subscribe`);
            setSubscribeData(response.data);
        } catch (error) {
            console.error('Error fetching about data:', error);
        }
    };  

    useEffect(() => {             
        fetchSubscribeData();   
    }, []);    

    const openSubpopup = () => {
        const popup = document.getElementById("subscribepopup");
        setShowPopmeup(false);
        popup.classList.toggle("show");
    };
    
    const closeSubpopup = () => {
        const popup = document.getElementById("subscribepopup");
        popup.classList.remove('show');
        setShowPopmeup(true);
    };

    return (
        <div>
            <section className="subscribepopup" id="subscribepopup">
                <div className="relative bg-white max-w-screen-xl mx-auto p-4 md:p-6 my-10 rounded-lg shadow-2xl">
                    <button onClick={closeSubpopup} 
                        className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"> X </button>
                    <div>
                        <h3 className="font-bold text-2xl">{subscribeData.seo_title}</h3>
                    </div>	  
                    <div className="mt-10">
                        <div 
                            className="text-justify text-gray-600 mb-8 px-5"
                            dangerouslySetInnerHTML={{ __html: subscribeData.cms_content }}
                        />
                    </div>
                </div>
            </section>
            {showPopmeup && (
                <section className="popmeup show text-center">
                    <div className="relative w-6/12 mx-auto">
                        <div className="image-section">
                            <img className="w-full p-2" src={paymentbg} alt="subscribe" />
                            <div className="absolute centre">
                                <div className="strip px-7 py-5">
                                    <h3 className="font-raleway text-gray-600 text-2xl"> USD <span className=" font-bold ">$74.95</span></h3>
                                    <button className="rounded lg:mx-0 bg-yellow-500 text-white font-bold py-2 mt-8 mb-5 px-4 focus:outline-none transform transition hover:scale-102 duration-300 ease-in-out">
                                    {userInfo ? 
                                        <Link to='/subscribe'>CLICK HERE FOR INSTANT ACCESS</Link> :
                                        <Link to='/register'>CLICK HERE FOR INSTANT ACCESS</Link> 
                                    }                         
                                    </button>
                                    <img className="carding" src={cards} alt="subscribe" />
                                </div>
                                <div className="btn_holder pb-4 mb-20">
                                    <a href="#" data-toggle="modal" data-target="#myModal" className="pb-4 float-left font-lato font-bold text-gray-600 text-lg ml-3"><i className="icon-list-alt"></i> View Sample Listing</a>
                                    <a className="pb-4 font-bold mr-3 float-right font-lato text-gray-600 text-lg" onClick={openSubpopup}><i className="icon-info-sign"></i> Learn More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default PaymentPopupBox;
