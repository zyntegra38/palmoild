import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : 
  <div>
      {/* <h1>401 Unauthorized</h1>
      <p>Oops! You are not authorized to access this page.</p> */}
  </div>;
};
export default PrivateRoute;
