import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowCircleUp } from 'react-icons/fa';

const Footer = () => {
	const scrollToTop = () => {
		window.scrollTo({
		  top: 0,
		  behavior: 'smooth'
		});
	};
  	return (
		<div className="foot">
			<footer className="" style={{ backgroundColor: 'rgba(37, 38, 65, 1)'}}>
				<div className="py-10">
					<div className="text-center text-white">
						<p className="my-3 text-gray-400 text-sm">© 2024 Palmoildirectory.com All Rights Reserved.</p>
					</div>
					<div className="flex items-center text-gray-400 text-sm justify-center">
						<Link to={'/aboutus'} className="pr-3" >About us</Link>
						<Link to={'/contact'} className="border-l border-gray-400 px-3">Contact Us</Link>
						<Link to={'/support'} className="border-l border-gray-400 px-3">Support</Link>
						<Link to={'/privacy'} className="border-l border-gray-400 px-3">Privacy Policy</Link>
						<Link to={'/terms'} className="border-l border-gray-400 px-3">Terms</Link>
						<Link to={'/cancellation'} className="border-l border-gray-400 px-3">Cancellation</Link>
						<Link to={'/shipping-and-delivery'} className="border-l border-gray-400 px-3">Shipping and Delivery</Link>
					</div>
					<div className='scrooll-top-top'>
						<FaArrowCircleUp onClick={scrollToTop} className="ml-3 cursor-pointer" style={{ fontSize: '3rem' }} />
					</div>
				</div>
				
			</footer>
		</div>
  	)
}

export default Footer
