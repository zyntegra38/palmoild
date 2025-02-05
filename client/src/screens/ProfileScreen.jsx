import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { useUpdateUserMutation, useUpdateUserPassMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PasswordStrengthBar from 'react-password-strength-bar';

const ProfileScreen = () => {
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const [updateUserPass] = useUpdateUserPassMutation();
  const [updateUser] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [shownewPassword, setnewShowPassword] = useState(false);
  const [shownewCPassword, setnewCShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    country_id: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });  
  const togglePasswordnewVisibility = () => {
    setnewShowPassword(!shownewPassword);
  };
  const togglePasswordnewCVisibility = () => {
    setnewCShowPassword(!shownewCPassword);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const [formData, setFormData] = useState({
    _id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    company: userInfo.company,
    address: userInfo.address,
    address2: userInfo.address2,
    country_id: userInfo.country_id,
    mobile: userInfo.mobile,
    password: '',
    confirmPassword: '', 
  });

  useEffect(() => {
    const fetchCountriesAndCategories = async () => {
      try {
          const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
          setCountries(countriesResponse.data);
      } catch (error) {
          console.error('Error fetching countries and categories:', error);
      }
    };
    fetchCountriesAndCategories();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;
  
    if (!formData.name.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        name: 'Contact name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        name: '',
      }));
    }
  
    if (!formData.email.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email is required',
      }));
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email format is not correct',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: '',
      }));
    }
  
    if (!formData.company.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        company: 'Company name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        company: '',
      }));
    }
  
    if (!formData.address.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: 'Address is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: '',
      }));
    }
  
    if (!formData.country_id.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        country_id: 'Country is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        country_id: '',
      }));
    }
  
    if (!formData.mobile.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: 'Mobile is required',
      }));
      isValid = false;
    } else if (!/^\+?\d+$/.test(formData.mobile.trim())) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: 'Mobile number should contain only digits',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: '',
      }));
    }
    
    return isValid;
  };

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        toast.success("Passwords Updated");
        window.scrollTo({
          top: 0,
          behavior: "smooth" 
        });
      } catch (error) {
        toast.error(error.data.error);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    const { _id,name, email, company, address, address2, country_id, mobile } = formData;
    if (!isValid) {
      return;
    }
    try {
        const res = await updateUser({
          _id,
          name,
          email,
          company,
          country_id,
          address,
          address2,
          mobile,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <div>      
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <section className="bg-white">    
        <div className="container mx-auto my-0 w-8/12 pt-10">
          <h2 className="font-bold text-2xl text-center font-raleway">Update Profile</h2>          
          <form className="mt-8"  onSubmit={submitHandler}>          
            <div className="reg-first-section">
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="hidden"
                  name="_id"
                  id="_id"
                  value={formData._id}
                  onChange={handleInputChange} />
                <input 
                  type="text"
                  name="name"
                  id="name"
                  placeholder='Contact Name  *'
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                  {validationErrors.name && <p className="text-red-500 text-xs italic">{validationErrors.name}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder='Email Address  *'
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled 
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.email && <p className="text-red-500 text-xs italic">{validationErrors.email}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="company" 
                  id="company" 
                  placeholder='Company  *'
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.company && <p className="text-red-500 text-xs italic">{validationErrors.company}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  placeholder='Address  *'
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.address && <p className="text-red-500 text-xs italic">{validationErrors.address}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="address2" 
                  id="address2" 
                  placeholder='Address 2 '
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.address && <p className="text-red-500 text-xs italic">{validationErrors.address2}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <select
                    id="country_id"
                    className="w-full rounded border px-6 py-3 font-lato text-gray-400 text-sm focus:outline-none font-semibold"
                    type="text"
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange} >
                    <option className="text-sm font-lato text-gray-600 font-semibold" value="">
                        Country *
                    </option>
                    {countries.map((country) => (
                        <option key={country._id} value={country._id} selected={formData.country_id === country._id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                {validationErrors.country_id && <p className="text-red-500 text-xs italic">{validationErrors.country_id}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="mobile" 
                  id="mobile" 
                  placeholder="Mobile Number  *"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.mobile && <p className="text-red-500 text-xs italic">{validationErrors.mobile}</p>}
              </div>
              <div className="my-5 mr-3.5 text-center">
                <button className="w-3/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" type="submit"> Update</button>
              </div>
            </div>         
          </form>
          <div className="container mx-auto my-0 w-8/12 pt-10">
            <h2 className="font-bold text-2xl text-center font-raleway">Change Password</h2>
              <form className="mt-8"  onSubmit={changePassword}>                        
                <div className="reg-first-section">
                    <div className="my-5 mr-3.5 text-center">
                        <div className="relative">
                          <input 
                            type="hidden"
                            name="_id"
                            id="_id"
                            value={formData._id}
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
    </div> 
    
  );
};

export default ProfileScreen;
