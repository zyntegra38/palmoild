import React from 'react';
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div className="error-container">
      <section className="bg-white py-8" id="about">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
            Coming Soon..
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
            <div className="text-gray-600 mb-8 mt-5 px-5 text-center">
              <Link className="italic font-bold" to="/">Go to Home</Link>
            </div>
          </div>
        </div>
      </section>     
    </div>
  );
};

export default Offers;
