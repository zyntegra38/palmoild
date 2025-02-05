import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import logo_img from '../images/logo.png';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { BACKEND_URL } from "../constans";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fb from '../images/fb.png';
import link from '../images/link.png';
import goog from '../images/goog.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/spinner.css';

const Header = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [logoutApiCall] = useLogoutMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
    const pathSegments = location.pathname.split('/').filter((seg) => seg !== '');
    const breadcrumbsArray = pathSegments.map((segment, index) => {
      const formattedLabel = segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
      return {
        label: formattedLabel,
        path: `/${pathSegments.slice(0, index + 1).join('/')}`,
      };
    });
    setBreadcrumbs(breadcrumbsArray);
  }, [location.pathname]);

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0 || (breadcrumbs.length === 1 && breadcrumbs[0].path === '/')) {
      return null;
    }
    return (
      <nav className="flex items-center py-4">
        <ol className="flex items-center space-x-1 text-xs text-gray-600">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="mx-1">&gt;&gt;</span>
          </li>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index}>
              <Link to={breadcrumb.path} className="text-gray-500 hover:text-gray-900">{breadcrumb.label}</Link>
              {index !== breadcrumbs.length - 1 && <span className="mx-1">&gt;&gt;</span>}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError('Email format is not correct');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleClick = () => {
    navigate('/forget-password');
    closePopup();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      closePopup();
      navigate('/search');
      setEmail('');
      setPassword('');
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const openPopup = () => {
    const popup = document.getElementById("loginme");
    popup.classList.toggle("show");
  };

  const closePopup = () => {
    document.querySelector('.popmeup').classList.remove('show');
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleAuth = () => {
    try {
      const res = window.open(`${BACKEND_URL}auth/google`, "_self");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleLinkedAuth = () => {
    try {
      const res = window.open(`${BACKEND_URL}auth/linkedin`, "_self");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const facebookAuth = () => {
    try {
      const res = window.open(`${BACKEND_URL}auth/facebook`, "_self");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false); // Close the submenu
  };

  return (
    <>
      {userInfo ? (
        <>
          {userInfo.role === 0 && userInfo.status === 0 ? (
            <div className="sticky top-0 z-50 bg-green-600 text-white text-center py-2">
              <a href="/subscribe">Subscribe now to unlock extra features! 🚀✨</a>
            </div>
          ) : null}
        </>
      ) : null}
      <header>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <div className='w-full text-gray-700'>
          <div className="row responsive_">
            <div className="responsive-head flex items-center justify-between">
              <div className="logoim"><a href="/"><img src={logo_img} alt="Logo" /></a></div>
              <button
                className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                onClick={toggleMenu}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
          <div className="bg-orange-600 ">
            <div className="row responsive_">
              <nav className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:justify-end pb-4 md:pb-0`}>
                {userInfo ? (
                  <>
                    {userInfo.role === 0 && userInfo.status === 1 ? (
                      <>
                        <Link to="/" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/' && 'active'}`}>HOME</Link>
                        <Link to="/search" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/search' && 'active'}`}>SEARCH</Link>
                        <Link to="/company" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/company' && 'active'}`}>MY COMPANY</Link>
                        <Link to="/favorites" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/favorites' && 'active'}`}>MY FAVOURITES</Link>
                        <Link to="/profile" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/profile' && 'active'}`}>PROFILE</Link>
                        <Link to="/blog" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/blog' && 'active'}`}>BLOG</Link>
                        <a className="popup px-6 py-5 font-semibold mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline" onClick={logoutHandler}>LOGOUT</a>
                      </>
                    ) : null}
                    {userInfo.role === 0 && userInfo.status === 0 ? (
                      <>
                        <Link to="/" className={`px-6 py-5 mt-2 font-semibold text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/' && 'active'}`}>HOME</Link>
                        <Link to="/search-companies" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/search-companies' && 'active'}`}>SEARCH</Link>
                        <Link to="/companies" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/companies' && 'active'}`}>COMPANIES</Link>
                        <Link to="/trade-reports" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/trade-reports' && 'active'}`}>TRADE REPORTS</Link>
                        <Link to="/pricing" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/pricing' && 'active'}`}>PRICING</Link>
                        <Link to="/profile" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/profile' && 'active'}`}>PROFILE</Link>
                        <Link to="/subscribe" className="font-semibold moving-bt px-10 py-3 mt-2 text-sm text-center bg-yellow-500 text-white md:mt-0 md:ml-4 hover:bg-green-600"><span></span> <span></span> <span></span> <span></span> SUBSCRIBE </Link>
                        <Link to="/blog" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/blog' && 'active'}`}>BLOG</Link>
                        <a className="popup px-6 py-5 font-semibold mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline" onClick={logoutHandler}>LOGOUT</a>
                      </>
                    ) : null}
                    {userInfo.role === 1 ? (
                      <>
                        <Link to="/admin-company" className={`px-6 py-5 font-medium mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-company' && 'active'}`}>COMPANY</Link>
                        <Link to="/admin-users" className={`px-6 py-5 font-medium mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-users' && 'active'}`}>USERS</Link>
                        <Link to="/admin-blog" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/blog' && 'active'}`}>BLOG</Link>
                        <Link to="/report-upload" className={`px-6 py-5 font-medium mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/report-upload' && 'active'}`}>UPLOAD REPORTS</Link>
                        <div className="relative group">
                          <button 
                            onClick={toggleSubmenu} 
                            className="px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold w-full text-left">
                            SETTINGS
                          </button>
                          {isSubmenuOpen && (
                            <div className="submenu absolute left-0 w-full bg-gray-100 text-white group-hover:block">
                              <div className="px-5">
                                <Link to="/admin-email" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-email' && 'active'}`}>CUSTOM MAIL</Link>
                                <Link to="/admin-templates" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-templates' && 'active'}`}>TEMPLATES</Link>
                                <Link to="/admin-mailhistory" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-mailhistory' && 'active'}`}>MAIL HISTORY</Link>
                                <Link to="/admin-site" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-site' && 'active'}`}>WEBSITES </Link>
                                <Link to="/admin-cms" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-cms' && 'active'}`}>CMS </Link>
                                <Link to="/admin-country" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-country' && 'active'}`}>COUNTRY</Link>
                                <Link to="/admin-category" onClick={closeSubmenu} className={`block px-1 py-1 text-sm bg-transparent text-black focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/admin-category' && 'active'}`}>CATEGORY</Link>
                              </div>
                            </div>
                          )}
                        </div>
                        <a className="popup px-6 py-5 font-medium mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold" onClick={logoutHandler}>LOGOUT</a>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Link to="/" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/' && 'active'}`}>HOME</Link>
                    <Link to="/companies" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/companies' && 'active'}`}>COMPANIES</Link>
                    <Link to="/contact" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/contact' && 'active'}`}>CONTACT </Link>
                    <Link to="/aboutus" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/aboutus' && 'active'}`}>ABOUT US</Link>
                    <Link to="/pricing" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/pricing' && 'active'}`}>PRICING</Link>
                    <Link to="/register" className={`px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide ${activeLink === '/register' && 'active'}`}>SIGN UP - IT'S FREE</Link>
                    <Link to="/blog" className={`px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-semibold ${activeLink === '/blog' && 'active'}`}>BLOG</Link>
                    <a className="popup px-6 py-5 text-sm text-center  bg-green-900 text-white md:ml-10 hover:text-gray-900 cursor-pointer font-raleway font-semibold" onClick={openPopup}>LOGIN</a>
                  </>
                )}
              </nav>
            </div>
          </div>
          <div className='row'>
            {renderBreadcrumbs()}
          </div>

          <section className="popmeup" id="loginme">
            <div className="relative bg-white w-5/12 mx-auto p-8 md:p-12 my-10  shadow-2xl">
              <button
                className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
                onClick={closePopup}
              >
                X
              </button>
              <div>
                <h3 className="font-bold text-2xl text-center font-raleway">Members Login</h3>
              </div>
              <div className="mt-10">
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-3.5/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mx-2 mt-4 sig font-semibold"
                    onClick={handleGoogleAuth}
                  >
                    <img src={goog} alt="Google" className="pr-2" />
                    Sign in with Google
                  </button>
                </div>
                <div className="or_with mx-5 text-center relative my-5">
                  <p className="font-lato text-sm text-gray-500">Or with email</p>
                </div>
                <form className="flex flex-col flex-respn" onSubmit={submitHandler}>
                  <div className="mb-2 pt-3 flex">
                    <input
                      htmlFor="email"
                      name="email"
                      type="email"
                      id="email"
                      placeholder='Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5"
                    />
                    {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                  </div>
                  <div className="mb-3 pt-3 flex relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      htmlFor="login-password"
                      id="login-password"
                      placeholder='Password'
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5 pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-0 top-0 bottom-0 px-6 py-2"
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                  </div>
                  <div className="flex flex-col text-right">
                    <label className="mx-5 mb-8 font-lato text-green-600 text-sm" onClick={handleClick}>Forget password?</label>
                  </div>
                  <button className="mx-5 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200" type="submit">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </header>
    </>
  );
};

export default Header;