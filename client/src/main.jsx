import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/style.css'
import './css/spinner.css';
import './css/PdfUpload.css';
import { HelmetProvider } from 'react-helmet-async';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import store from './store';
import { Provider } from 'react-redux';

import CountryScreen from './admin/CountryScreen.jsx';
import SearchCompanies from './screens/SearchCompanies.jsx';
import SiteScreen from './admin/SiteScreen.jsx';
import CategoryScreen from './admin/CategoryScreen.jsx';
import CompanyScreen from './admin/CompanyScreen.jsx';
import AddCompany from './admin/AddCompany.jsx';
import CMSScreen from './admin/CMSScreen.jsx';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ContactScreen from './user/ContactScreen.jsx';
import CategoryList from './screens/CategoryList.jsx'
import CategorySingle from './screens/CategorySingle.jsx';
import CountryList from './screens/CountryList.jsx';
import CountrySingle from './screens/CountrySingle.jsx';
import CompanySingles from './screens/CompanySingles.jsx';
import CompanyList from './screens/CompanyList.jsx';
import CompanySingle from './screens/CompanySingle.jsx';
import Search from './screens/Search.jsx';
import UserCompany from './user/UserCompany.jsx';
import AboutScreen from './user/AboutScreen.jsx';
import Users from './user/Users.jsx';
import Favorites from './user/Favorites.jsx';
import Payment from './user/PayPalPayment.jsx';
import ForgetPassword from './screens/ForgetPassword.jsx';
import SupportScreen from './user/SupportScreen.jsx';
import NewPassword from './screens/NewPassword.jsx';
import NotFound from "./components/NotFoundPage.jsx";
import Cancellation from './user/Cancellation.jsx';
import PrivacyPolicy from './user/PrivacyPolicy.jsx';
import TermsScreen from './user/TermsScreen.jsx';
import PricingScreen from './user/PricingScreen.jsx';
import Blog from './screens/Blog.jsx';
import BlogSingle from './screens/BlogSingle.jsx';
import BlogList from './admin/BlogList.jsx';
import Shipping from './user/ShippingScreen.jsx';
import Offers from './screens/Offers.jsx';
import SendEmail from './admin/SendEmail.jsx';
import MailHistory from './admin/MailHistory.jsx';
import PdfUpload from './admin/PdfUploadScreen.jsx';
import PdfDisplayPage from './screens/PdfDisplay.jsx';
import FeaturedCompanyScreen from './admin/FeaturedCompanyScreen.jsx';
import FeaturedAddCompany from './admin/FeaturedAddCompany.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TemplateScreen from './admin/TemplateScreen.jsx';
import PricingScreens from './user/PricingScreens.jsx';
import FeaturedSingle from './screens/FeaturedSingle.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/contact' element={<ContactScreen />} />
      <Route path='/aboutus' element={<AboutScreen />} />
      <Route path='/support' element={<SupportScreen />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path="/user/newpassword/:token" element={<NewPassword/>} />
      <Route path='/privacy' element={<PrivacyPolicy />} />
      <Route path='/cancellation' element={<Cancellation />} />
      <Route path='/shipping-and-delivery' element={<Shipping />} />
      <Route path='/terms' element={<TermsScreen />} />
      <Route path="/:companyName" element={<CompanySingles />} />
      <Route path="/c/:categoryName" element={<CategorySingle />} />      
      <Route path='/categories' element={<CategoryList />} />
      <Route path='/countries' element={<CountryList />} />
      <Route path="/countries/:countryName" element={<CountrySingle />} />
      <Route path='/companies' element={<CompanyList />} />
      <Route path="/companies/:companyName" element={<CompanySingle />} />
      <Route path='/company' element={<UserCompany />} />
      <Route path='/payments' element={<PricingScreens />} />
      <Route path='/pricing' element={<PricingScreen />} />
      <Route path="/featuredcompanies/:companyName" element={<FeaturedSingle />} />
      <Route path='/offers' element={<Offers />} />
      <Route path='/blog' element={<Blog />} />
      <Route path='/blog/:key' element={<BlogSingle />} />
      <Route path='/trade-reports' element={<PdfDisplayPage />} />
      
      <Route path='' element={<PrivateRoute />}>
        <Route path='/admin-country' element={<CountryScreen />} />
        <Route path='/admin-blog' element={<BlogList />} />
        <Route path='/admin-email' element={<SendEmail />} />
        <Route path='/admin-company' element={<CompanyScreen />} />
        <Route path='/admin-featuredcompany' element={<FeaturedCompanyScreen />} />
        <Route path='/admin-site' element={<SiteScreen />} />
        <Route path='/admin-category' element={<CategoryScreen />} />
        <Route path='/admin-cms' element={<CMSScreen />} />      
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/add-company' element={<AddCompany />} />
        <Route path='/add-featuredcompany' element={<FeaturedAddCompany />} />
        <Route path='/edit-company/:companyId' element={<AddCompany />} />
        <Route path='/edit-featuredcompany/:companyId' element={<FeaturedAddCompany />} />
        <Route path='/admin-users' element={<Users />} />
        <Route path='/admin-mailhistory' element={<MailHistory />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search-companies' element={<SearchCompanies />} />
        <Route path='/subscribe' element={<Payment />} />
        <Route path='/favorites' element={<Favorites />} />        
        <Route path='/admin-templates' element={<TemplateScreen />} />
        <Route path='/report-upload' element={<PdfUpload />} />     
      </Route>
      <Route path='*' element={<NotFound />} /> 
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
      {/* <React.StrictMode> */}
        <RouterProvider router={router} />
      {/* </React.StrictMode> */}
    </HelmetProvider>
  </Provider>
);
