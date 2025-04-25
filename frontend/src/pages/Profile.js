import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const Profile = () => {
  const { user } = useContext(AuthContext);
  return <div><h2>Profile</h2><p>Name: {user.name}</p><p>Role: {user.role}</p></div>;
};
export default Profile;