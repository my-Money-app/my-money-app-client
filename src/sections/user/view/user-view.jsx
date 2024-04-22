import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { BaseUrl } from 'src/helpers/mainUrl';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModal, setOpenModal] = useState(false);

  const [outcomeName, setOutcomeName] = useState('');

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleAddOutcome = async () => {
    try {
      // Get the user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
      const token = localStorage.getItem('token');

      // Create a new outcome object with name and owner properties
      const name = outcomeName;

      // Send a POST request to the API to create the outcome
      const response = await axios.post(
        `${BaseUrl}/outcomes/${userId}`,
        {
          outcome: name, // Assuming 'name' is the variable containing the outcome to be sent.
        },
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header, prefixed with 'Bearer'.
          },
        }
      );

      // Check if the outcome was successfully created
      if (response.status === 201) {
        // Outcome created successfully, you can handle any further actions here

        // Reset the outcome name input field and close the modal
        setOutcomeName('');
        setOpenModal(false);
        window.location.reload();

        // You may want to refresh the outcomes list after adding a new one
        // You can fetch outcomes again or update the state with the newly created outcome
      } else {
        // Handle error response if needed
        console.error('Failed to create outcome:', response.data);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error creating outcome:', error);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = outcomes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const [outcomes, setOutcomes] = useState();
  const fetchOutcomes = async () => {
    try {
      // Retrieve the user ID from localStorage
      const userId =  localStorage.getItem('userId');

      const token = localStorage.getItem('token');
      // If user ID is not found in localStorage, handle the error
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      // Make a GET request to fetch outcomes for the user
      const response = await axios.get(`${BaseUrl}/outcomes/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      // Update the outcomes state with the fetched data
      setOutcomes(response.data);
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);
  const dataFiltered = applyFilter({
    inputData: outcomes,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Outcomes</Typography>

        <Button
          onClick={handleOpenModal}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Spending
        </Button>
      </Stack>
      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          idsSelected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={outcomes?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'Value', label: 'Value' },
                  { id: 'status', label: 'Status' },
                  { id: 'last update', label: 'last update' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      id={row._id}
                      name={row.name}
                      status={row.status}
                      value={row.value}
                      lastModif={row.valueHistory[0]?.date || row.updatedDate}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, outcomes?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={outcomes?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Modal
        open={openModal}
        onClose={handleOpenModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ width: '50%', justifySelf: 'center', alignSelf: 'center' }}
      >
        <Card>
          <Stack spacing={2} p={4}>
            <Typography variant="h6" id="modal-title">
              New Outcome
            </Typography>
            <TextField
              label="Outcome Name"
              variant="outlined"
              value={outcomeName}
              onChange={(e) => setOutcomeName(e.target.value.toString())}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleAddOutcome}>
                Add
              </Button>
              <Button variant="contained" onClick={handleOpenModal}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Modal>
    </Container>
  );
}
