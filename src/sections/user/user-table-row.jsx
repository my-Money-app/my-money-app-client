import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  id,
  avatarUrl,
  company,
  role,
  isVerified,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handlePress = (outId) => {
    // Navigate to OutcomeDetails component with the outcome details
    navigate(`/outcome-details/${outId}`, { theOutcomeId: outId });
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Function to handle the deletion of an outcome
  const handleDeleteOutcome = async (outcomeId) => {
    try {
      // Send a DELETE request to the backend API to delete the outcome
      const response = await axios.delete(`http://localhost:3120/outcomes/${outcomeId}`);

      // Check if the deletion was successful
      if (response.status === 200) {
        // Outcome deleted successfully
        console.log('Outcome deleted successfully');
        window.location.reload();
        // You may want to refresh the list of outcomes after deletion
        // You can fetch outcomes again or update the state to remove the deleted outcome
      } else {
        // Handle error response if needed
        console.error('Failed to delete outcome');
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error deleting outcome:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell onClick={()=>handlePress(id)} component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={()=>handlePress(id)}>{company}</TableCell>

        <TableCell onClick={()=>handlePress(id)}>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell>
        <TableCell onClick={()=>handlePress(id)}>{new Date().getFullYear()}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={()=>handlePress(id)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => handleDeleteOutcome(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  id: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
