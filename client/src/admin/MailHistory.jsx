import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";

const MailHistory = () => {
  const [mailData, setMailData] = useState([]);
  
  const fetchMails = async () => {
    try {
        const response = await axios.get(`${ BACKEND_URL }api/mailer/mailshistory`);
        setMailData(response.data);
    } catch (error) {
        console.error('Error fetching blog:', error);
    }
  };

  useEffect(() => {
    fetchMails();
  }, []);

  return (
    <div>
      <div className="relative block md:w-full justify-center px-10 mb-5 mt-12 items-center">
        <div className="table-responsive">
          <table className="mt-4 w-3/4 text-left">
            <thead>
              <tr>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">User Name</th>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">User Email</th>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Subject</th>
                <th className="font-lato text-white bg-green-500 text-sm p-2 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody>
              {mailData.map((mail) => {
                const createdAtDate = new Date(mail.createdAt);
                const createdAtDateString = createdAtDate.toLocaleDateString('en-GB'); 
                return (
                  <tr key={mail._id}>
                    <td className="font-lato text-gray-600 text-sm p-2">{mail.name}</td>
                    <td className="font-lato text-gray-600 text-sm p-2">{mail.email}</td>
                    <td className="font-lato text-gray-600 text-sm p-2">{mail.subject}</td>
                    <td className="font-lato text-gray-600 text-sm p-2">{createdAtDateString}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MailHistory;