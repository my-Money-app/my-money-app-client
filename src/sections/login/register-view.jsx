import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import VerificationModal from './VerificationModal';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();
  const [user, setUser] = useState({
    name: '',
    email: '',
    pwd: '',
    rpwd: '',
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3120/auth/register', user);
      console.log('Response:', response.data);
      setUserId(response.data.userId);
      setLoading(false);
      alert('user created successfully!');
      setUser({
        name: '',
        email: '',
        pwd: '',
        rpwd: '',
      });
      setOpenModal(true);
    } catch (error) {
      console.error('Error registring user:', error);

      // Display appropriate error messages based on error response
      if (error.response) {
        setLoading(false);
        // The request was made and the server responded with a status code
        if (error.response.status === 402) {
          alert('invalid email format');
        } else if (error.response.status === 400) {
          alert('User with this email already exists');
        } else if (error.response.status === 406) {
          alert('please verify your password');
        } else if (error.response.status === 401) {
          alert('please fill in all fields');
        } else if (error.response.status === 500) {
          alert('error sending the verification email try to login and resend it');
        } else {
          alert('Error: An unexpected error occurred. Please try again later.');
        }
      } else if (error.request) {
        setLoading(false);

        // The request was made but no response was received
        alert('Network error: Please check your internet connection and try again.');
      } else {
        setLoading(false);
        // Something else happened while setting up the request
        alert('Error: An unexpected error occurred. Please try again later.');
      }
    }
  };
  const navigate = useNavigate();

  const handleCloseModal = async () => {
    setOpenModal(false);
    try {
      const response = await axios.post('http://localhost:3120/auth/verifyUser', {
        userId,
        code: verificationCode,
      });
      console.log(response.data);
      navigate("/login")
    } catch (error) {
      console.log(error);
    }
  };
  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Name" onChange={handleInputChange} value={user.name} />
        <TextField
          name="email"
          label="Email address"
          onChange={handleInputChange}
          value={user.email}
        />
        <TextField
          onChange={handleInputChange}
          name="pwd"
          label="Password"
          value={user.pwd}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="rpwd"
          onChange={handleInputChange}
          label="Confirm Password"
          type={showRepeatPassword ? 'text' : 'password'}
          value={user.rpwd}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)} edge="end">
                  <Iconify icon={showRepeatPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <br />
      <br />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit}
      >
        {loading ? 'Loading...' : 'Register'}
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Create an account</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link href="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
              login
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
      
      <VerificationModal
        open={openModal}
        handleClose={handleCloseModal}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
      />
    </Box>
  );
}
