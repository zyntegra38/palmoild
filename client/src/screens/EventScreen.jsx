import React from 'react';
import background from '../images/vlo.jpg'

const EventScreen = () => {
  return (
    <div>
      <div className="pt-24 backdropse h-96" style={{ backgroundImage: `url(${background})`}}>
        <div className="px-3 mx-auto items-center content-center grid">
          <div className="relative z-10 justify-center text-center">
              <h1 className="my-4 text-gray-100 text-5xl font-bold leading-tight">
                  About Us
              </h1>
              <p className="block uppercase tracking-loose w-full text-white font-bold">
                  <span> <a href="#">Home</a>&nbsp; &#8594; &nbsp;Events</span>
              </p>
          </div>
        </div>
      </div>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          About Us
          </h2>
		      <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <p className="text-justify text-gray-600 mb-8 px-5">Commoditylife publishes two leading business directory for the Palm Oil and EdibleOil 
          industry. The information provided in these directories has been recognized and appreciated by clients globally. The company 
          profiles and product catalogs details provided in the directory has helped in developing, supporting and promoting better trade 
          relationships in the Palm Oil & EdibleOil sector.<br>
          </br>The EdibleOil Directory is the world-wide directory for the EdibleOil industry.</p>
		    </div>
	    </section>	
    </div>
  );
};

export default EventScreen;
