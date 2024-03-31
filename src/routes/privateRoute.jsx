import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Route, Routes, Navigate } from 'react-router-dom';

// Assuming you have a function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if token exists in local storage
  const token = localStorage.getItem('token');
  // Return true if token exists, indicating the user is logged in
  return token !== null;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Routes>
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? <Component {...props} /> : <Navigate to="/login" replace />
      }
    />
  </Routes>
);

// Validate the component prop
PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
