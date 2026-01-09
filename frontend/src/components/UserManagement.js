import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);


  const navigator = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, search: searchTerm, limit: 10 }
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}" and all their data?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  const viewUserDetails = (userId) => {
navigator(`/admin/users/${userId}`);

  };


  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn-primary" onClick={fetchUsers}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Resumes</th>
                  <th>Joined</th>
                  <th>Last Activity</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {user.name || 'Unknown'}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge">{user.resume_count}</span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      {user.last_resume_activity 
                        ? new Date(user.last_resume_activity).toLocaleDateString()
                        : 'No activity'
                      }
                    </td>
                    <td>
                      <select 
                        value={user.role || 'user'} 
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-sm btn-view"
                          title="View User Details"
                          onClick={() => viewUserDetails(user.id)}
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-sm btn-danger"
                          onClick={() => deleteUser(user.id, user.name)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="no-data">
                {searchTerm ? 'No users found matching your search' : 'No users found'}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn-pagination"
            disabled={!pagination.hasPrev}
            onClick={() => setCurrentPage(pagination.currentPage - 1)}
          >
            ← Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            {pagination.totalUsers && ` (${pagination.totalUsers} total users)`}
          </span>
          
          <button 
            className="btn-pagination"
            disabled={!pagination.hasNext}
            onClick={() => setCurrentPage(pagination.currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;