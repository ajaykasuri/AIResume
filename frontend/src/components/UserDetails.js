import React,{useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const UserDetails = () => {
  const { userId } = useParams();   

  useEffect(() => {
    // Fetch user details using userId
const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle the response data
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);

      alert('Failed to fetch user details');
    }
  };
fetchUserDetails();
  }, [userId]);
  return (
    <div>
      <h2>User Details Page</h2>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default UserDetails;
