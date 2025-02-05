import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_URL } from '../constans';

const Users = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedUser, setSelectedUser] = useState(null);  
  const [staff, setStaff] = useState([]);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const activeResponse = await axios.get(`${BACKEND_URL}api/users/active`);
        setActiveUsers(activeResponse.data);

        const inactiveResponse = await axios.get(`${BACKEND_URL}api/users/inactive`);
        setInactiveUsers(inactiveResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${BACKEND_URL}api/users/${userId}`);
      toast.success('User removed');
      const activeResponse = await axios.get(`${BACKEND_URL}api/users/active`);
      setActiveUsers(activeResponse.data);
      window.scrollTo({
        top: 0,
        behavior: "smooth" 
      });
      const inactiveResponse = await axios.get(`${BACKEND_URL}api/users/inactive`);
      setInactiveUsers(inactiveResponse.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchCompanyDetails = async (userId) => {
    const response = await axios.get(`${ BACKEND_URL }api/companies/user/${userId}`);
    const companyData = response.data;
    setCompany(companyData);
    const staffresponse = await axios.get(`${ BACKEND_URL }api/staff/${companyData._id}`);
    const staffData = staffresponse.data;
    if (Array.isArray(staffData)) {
      setStaff(staffData);
    } else {
      const staffArray = Object.values(staffData);
      setStaff(staffArray);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    fetchCompanyDetails(user._id);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setCompany([]);
    setStaff([]);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />     
      
      <div className='mt-5'>
        <div className="relative block w-3/4 px-10 mb-5 mt-5 text-right">        
          <ul className="flex text-right">
            <li className={activeTab === 'active mx-2' ? 'active-tab mx-2' : 'mx-2'}>
              <button className={`text-white font-raleway px-3 py-1.5 text-sm rounded inline-block mb-4 ${activeTab === 'active' ? 'bg-green-500' : 'bg-gray-200'}`} onClick={() => handleTabChange('active')}>Active Users</button>
            </li>
            <li className={activeTab === 'inactive' ? 'active-tab' : ''}>
              <button className={`text-white font-raleway px-3 py-1.5 text-sm rounded inline-block mb-4 ${activeTab === 'inactive' ? 'bg-green-500' : 'bg-gray-200'}`} onClick={() => handleTabChange('inactive')}>Inactive Users</button>
            </li>
          </ul>
        </div>
      </div>
      {activeTab === 'active' && (
        <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
          <div className="table-responsive">
            <table className="mt-4 w-3/4 border-collapse text-left">
              <thead>
                <tr>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Name</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Email</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Created At</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Expired At</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {activeUsers.map((user) => {
                      const createdAtDate = new Date(user.createdAt);
                      const createdAtDateString = createdAtDate.toLocaleDateString();
                      return (
                          <tr key={user._id}>
                          <td className="font-lato text-gray-600 text-sm p-2">{user.name}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">{user.email}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">{createdAtDateString}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">{user.expiryDate}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">
                            <button onClick={() => handleView(user)}
                              className="bg-blue-500 hover:bg-red-700 text-white font-raleway px-3 mr-2 py-1.5 text-sm rounded focus:outline-none focus:shadow-outline">
                              View
                            </button>
                            <button onClick={() => handleDelete(user._id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-raleway px-3 py-1.5 text-sm rounded focus:outline-none focus:shadow-outline">
                              Delete
                            </button>
                              
                          </td>
                          </tr>
                      );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'inactive' && (
        <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
          <div className="table-responsive">
            <table className="mt-4 w-3/4 border-collapse text-left">
              <thead>
                <tr>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Name</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Email</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Created At</th>
                  <th className="font-lato text-white bg-green-500 text-sm p-2 text-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {inactiveUsers.map((user) => {
                      const createdAtDate = new Date(user.createdAt);
                      const createdAtDateString = createdAtDate.toLocaleDateString();
                      return (
                          <tr key={user._id}>
                          <td className="font-lato text-gray-600 text-sm p-2">{user.name}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">{user.email}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">{createdAtDateString}</td>
                          <td className="font-lato text-gray-600 text-sm p-2">
                            <button onClick={() => handleView(user)}
                              className="bg-blue-500 hover:bg-red-700 text-white font-raleway px-3 mr-2 py-1.5 text-sm rounded focus:outline-none focus:shadow-outline">
                              View
                            </button>
                            <button onClick={() => handleDelete(user._id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-raleway px-3 py-1.5 text-sm rounded focus:outline-none focus:shadow-outline">
                              Delete
                            </button>
                              
                          </td>
                          </tr>
                      );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selectedUser && (
        <section className="selectedCompany-modal">
          <div className="modal fade in z-30">
            <div className="modal-dialog bg-white p-5 z-50">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" onClick={closeModal} className="close">×</button>
                </div>
                <div className="modal-body">
                  <div className="simple-div">
                    <h4 className="bd-setails block text-gray-700 text-lg mb-2 font-raleway">User Details</h4>
                    <div className="add-details">
                      <table className="table table-striped">
                        <tbody>
                          {typeof selectedUser.name === 'string' && selectedUser.name.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Name</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedUser.name}</td>
                            </tr>
                          )}
                          {typeof selectedUser.mobile === 'string' && selectedUser.mobile.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Mobile</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedUser.mobile}</td>
                            </tr>
                          )}
                          {typeof selectedUser.email === 'string' && selectedUser.email.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Email</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedUser.email}</td>
                            </tr>
                          )}
                          {typeof selectedUser.address === 'string' && selectedUser.address.trim() !== '' && (
                              <tr>
                                <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Address</td>
                                <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedUser.address}</td>
                              </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {Object.keys(company).length > 0 ? (
                  <div className="simple-div">
                    <h4 className="bd-setails block text-gray-700 text-lg mb-2 font-raleway">Listings Details</h4>
                    <div className="add-details">
                      <table className="table table-striped">
                        <tbody>
                          {typeof company.company === 'string' && company.company.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Company</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{company.company}</td>
                            </tr>
                          )}
                          {typeof company.description === 'string' && company.description.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Description</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{company.description}</td>
                            </tr>
                          )}
                          {typeof company.mobile === 'string' && company.mobile.trim() !== '' && (
                              <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Mobile</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{company.mobile}</td>
                            </tr>
                          )}
                          {typeof company.email === 'string' && company.email.trim() !== '' && (
                              <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Email</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{company.email}</td>
                            </tr>
                          )}
                          {typeof company.website === 'string' && company.website.trim() !== '' && (
                              <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Website</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{company.website}</td>
                            </tr>
                          )}
                          {typeof company.address === 'string' && company.address.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Address</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{company.address}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  ) : (
                    <div></div>
                  )}
                  {staff.map((staffMember, index) => (
                  <div className="simple-div">
                    <h4 className="bd-setails block text-gray-700 text-lg mb-2 font-raleway">Contact Details</h4>
                    <div className="add-details">
                      <table className="table table-striped">
                        <tbody>
                          {typeof staffMember.name === 'string' && staffMember.name.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Name</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{staffMember.name}</td>
                            </tr>
                          )}
                          {typeof staffMember.email === 'string' && staffMember.email.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Email</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{staffMember.email}</td>
                            </tr>
                            )}
                          {typeof staffMember.mobile === 'string' && staffMember.mobile.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Mobile</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{staffMember.mobile}</td>
                            </tr>
                          )}
                          {typeof staffMember.designation === 'string' && staffMember.designation.trim() !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Designation</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{staffMember.designation}</td>
                            </tr>
                          )}                        
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm "></td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm "></td>
                          </tr>                           
                        </tbody>
                      </table>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Users;
