// import axios from 'axios';

// const getUserData = async () => {
//   try {
//     // Retrieve token from local storage
//     const token = localStorage.getItem('token');

//     if (!token) {
//       throw new Error('Token not found in local storage');
//     }

//     // Send token to server endpoint using the Authorization header
//     const response = await axios.get('http://localhost:3120/auth/get-user', {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include token in the Authorization header
//       },
//     });

//     // Extract user data from the response
//     const userData = response.data;

//     return userData;
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error;
//   }
// };
// export default getUserData();

// ----------------------------------------------------------------------

export const account = {
  displayName: 'user.fullName',
  email: 'user.email',
  photoURL: '/assets/images/avatars/avatar_25.jpg',
};
