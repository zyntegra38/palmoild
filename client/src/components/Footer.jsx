import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleUp } from 'react-icons/fa';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation, useUpdateUserPassMutation } from "../slices/usersApiSlice";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { setCredentials } from "../slices/authSlice";
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
	const scrollToTop = () => {
		window.scrollTo({
		  top: 0,
		  behavior: 'smooth'
		});
	};
	const { userInfo } = useSelector((state) => state.auth);
	const [password, setPassword] = useState('');
	const [shownewPassword, setnewShowPassword] = useState(false);
	const [shownewCPassword, setnewCShowPassword] = useState(false);
	const [updateUserPass] = useUpdateUserPassMutation();
	const dispatch = useDispatch();
  
	useEffect(() => {
		if (userInfo) {
		  setFormData((prevData) => ({
			...prevData,
			_id: userInfo._id, 
		  }));
		}
	  }, [userInfo]);

	const [formData, setFormData] = useState({
	  _id:'',
	  password: '',
	  confirmPassword: '', 
	});
  
	const handleInputChange = (e) => {
	  setFormData({
		...formData,
		[e.target.name]: e.target.value,
	  });
	};
  
	const togglePasswordnewVisibility = () => {
	  setnewShowPassword(!shownewPassword);
	};
	const togglePasswordnewCVisibility = () => {
	  setnewCShowPassword(!shownewCPassword);
	};
	const handlePasswordChange = (e) => {
	  setPassword(e.target.value);
	};
  
	const changePassword = async (e) => {
		e.preventDefault();
		const isValidPass = validatePassForm();
		if (!isValidPass) {
		  return;
		}
		const { _id, confirmPassword } = formData; 
		if (password !== confirmPassword) {
		  toast.error("Passwords do not match");
		} else {
		  try {        
			const res = await updateUserPass({_id,password}).unwrap();
			console.log(res);
			dispatch(setCredentials({ ...res }));
			toast.success("Password Updated");
			window.scrollTo({
			  top: 0,
			  behavior: "smooth" 
			});
		  } catch (error) {
			toast.error(error.data.error);
		  }
		}
	};
	  

	const [validationErrors, setValidationErrors] = useState({
	  password: '',
	  confirmPassword: '',
	}); 
  
	const validatePassForm = () => {
	  let isValidPass = true;
  
	  if (!password.trim()) {
		setValidationErrors(prevErrors => ({
		  ...prevErrors,
		  password: 'Password is required',
		}));
		isValidPass = false;
	  } else if (password.trim().length < 6) {
		setValidationErrors(prevErrors => ({
		  ...prevErrors,
		  password: 'Password must be at least 6 characters long',
		}));
		isValidPass = false;
	  } else {
		setValidationErrors(prevErrors => ({
		  ...prevErrors,
		  password: '',
		}));
	  }
	
	  if (!formData.confirmPassword.trim()) {
		setValidationErrors(prevErrors => ({
		  ...prevErrors,
		  confirmPassword: 'Confirm Password is required',
		}));
		isValidPass = false;
	  } else if (formData.confirmPassword.trim() !== password.trim()) {
		setValidationErrors(prevErrors => ({
		  ...prevErrors,
		  confirmPassword: 'Passwords do not match',
		}));
		isValidPass = false;
	  } else {
		setValidationErrors(prevErrors => ({
		  ...prevErrors,
		  confirmPassword: '',
		}));
	  }
	  return isValidPass;
	};
  
  	return (
		<div className="foot">
			{userInfo ? (
                  <>
                    {userInfo.provider === "card" ? (
                      <>
                      <section className="popmeup show" id="loginme">
                      <div className="relative bg-white w-5/12 mx-auto p-8 md:p-12 my-10  shadow-2xl">
                        <div>
                          <h3 className="font-bold text-2xl text-center font-raleway">Change Password</h3>
                        </div>
                        <div className="mt-10">
                          <form className="mt-8"  onSubmit={changePassword}>                        
                            <div className="reg-first-section">
                                <div className="my-5 mr-3.5 text-center">
                                    <div className="relative">
									<input 
										type="hidden"
										name="_id"
										id="_id"
										value={userInfo._id}
										onChange={handleInputChange} />
                                  </div>
                                </div>
                                <div className="my-5 mr-3.5 text-center">   
                                  <div className="relative">
                                      <input 
                                          type={shownewPassword ? "text" : "password"} 
                                          id="password" 
                                          name="password"
                                          placeholder="Password  *"
                                          value={password}
                                          onChange={handlePasswordChange}
                                          className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                                      <button type="button"
                                          onClick={togglePasswordnewVisibility}
                                          className="absolute right-0 top-0 mt-3 mr-4">
                                          {shownewPassword ? <FaEye /> : <FaEyeSlash />} 
                                      </button>
                                  </div>
                                  {validationErrors.password && <p className="text-red-500 text-xs italic">{validationErrors.password}</p>}
                                </div>
                                <div className="my-5 mr-3.5 text-center">
                                  <div className="relative">
                                      <input 
                                          type={shownewCPassword ? "text" : "password"} 
                                          name="confirmPassword" 
                                          id="confirmPassword"
                                          placeholder= "Confirm Password  *"
                                          value={formData.confirmPassword}
                                          onChange={handleInputChange}
                                          className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                                      <button type="button"
                                          onClick={togglePasswordnewCVisibility}
                                          className="absolute right-0 top-0 mt-3 mr-4">
                                          {shownewCPassword ? <FaEye /> : <FaEyeSlash />} 
                                      </button>
                                  </div>
                                  <PasswordStrengthBar password={password} />
                                  {validationErrors.confirmPassword && <p className="text-red-500 text-xs italic">{validationErrors.confirmPassword}</p>}
                                </div>                    
                                <div className="my-5 mr-3.5 text-center">
                                    <button className="w-4/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
                                      > Change Password </button>
                                </div> 
                            </div>  
                          </form>
                        </div>
                      </div>
                    </section>
                    </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
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
