import axios from 'axios';
// import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import Iconify from 'src/components/iconify';

// import AppNewsUpdate from '../app-news-update';
import { BaseUrl } from 'src/helpers/mainUrl';

import MessageModal from 'src/sections/messages/MessageModel';

import LoadingComponent from '../loading/Loading';
// import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [loading, setLoading] = useState(false);
  const [outcomeForWeek, setOutcomeForWeek] = useState();
  const [outcomeFormonth, setOutcomeFormonth] = useState();
  // outcomes value per day
  const [outComeLabel, setOutcomeLabel] = useState();
  const [serieData, setSerieData] = useState();

  // get outcomes
  const [outcomes, setOutcomes] = useState();

  // date for stats
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10)); // Initialize with today's date

  const [outcomesMonth, setOutcomesMonth] = useState();

  const getOutcomesPerWeekSum = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(
        `${BaseUrl}/dashboard/sum-for-week/${userId}`,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        setOutcomeForWeek(response.data.totalValueForWeek);
        console.log(response.data.totalValueForWeek);
        setLoading(false);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
      setLoading(false);
    }
  };
  const getOutcomesPerMonthSum = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(
        `${BaseUrl}/dashboard/sum-for-month/${userId}`,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header
          },
          iid: userId,
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        setOutcomeFormonth(response.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
      setLoading(false);
    }
  };

  const fetchOutcomes = async () => {
    try {
      setLoading(true);
      // Retrieve the user ID from localStorage
      const userId = localStorage.getItem('userId');
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
      const seriesData = response.data.map((outcome) => ({
        label: outcome.name,
        value: outcome.value,
      }));
      setOutcomes(seriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching outcomes:', error);
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    event.preventDefault();
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    getCostumOutcomesValuePerDay(newStartDate);
  };

  // custom outcomes
  const getCostumOutcomesValuePerDay = async (newStartDate) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(
        `${BaseUrl}/dashboard/Customperday/${userId}`,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header
          },
          params: {
            startDate: newStartDate, // Pass startDate as a query parameter
            iid: userId, // Pass iid as a query parameter
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        // Get the list of unique outcome names dynamically
        const outcomeNames = Object.keys(response.data);

        // Map perDay to the format expected by the component
        const outcomeLabels = Object.keys(response.data[outcomeNames[0]]);
        setOutcomeLabel(outcomeLabels);
        const types = ['column', 'area', 'line'];
        const seriesData = outcomeNames.map((outcomeName) => ({
          name: outcomeName,
          type: types[Math.floor(Math.random() * types.length)],
          fill: 'solid',
          data: outcomeLabels.map((date) => response.data[outcomeName][date]),
        }));
        setSerieData(seriesData);
        setLoading(false);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
      setLoading(false);
    }
  };
  const getOutcomesPerMonth = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(
        `${BaseUrl}/dashboard/permonth/${userId}`,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header
          },
          iid: userId,
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        const seriesData = response.data.map((outcome) => ({
          label: outcome.name,
          value: outcome.value,
        }));
        setOutcomesMonth(seriesData);
        setLoading(false);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
      setLoading(false);
    }
  };

  // average spendings/day
  const [ED, setED] = useState(new Date().toISOString().slice(0, 10));
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7); // Subtract 7 days from the current date
  const sevenDaysAgo = currentDate.toISOString().slice(0, 10);
  const [SD, setSD] = useState(sevenDaysAgo);

  const handleED = (event) => {
    const endDate = new Date(event.target.value); // Convert the input value to a Date object
    const DateStart = new Date(SD); // Convert SD to a Date object
    if (DateStart.getTime() < endDate.getTime()) {
      setED(event.target.value);
    } else {
      alert("Start date can't be greater than or equal to end date");
    }
  };

  const handleSD = (event) => {
    const DateSTR = new Date(event.target.value); // Convert the input value to a Date object
    const endDate = new Date(ED); // Convert ED to a Date object
    if (DateSTR.getTime() < endDate.getTime()) {
      setSD(event.target.value);
    } else {
      alert("Start date can't be greater than or equal to end date");
    }
  };
  const [average, setAverage] = useState();

  const getAverageSpendings = async (SDT, EDT) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(
        `${BaseUrl}/dashboard/average-per-day/${userId}`,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header
          },
          params: {
            startDate: SDT,
            endDate: EDT,
            iid: userId, // Pass iid as a query parameter
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        setAverage(response.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
      setLoading(false);
    }
  };
  // get the balance
  const [balance, setBalance] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [message, setMessage] = useState(null);
  const [messageModal, setMessageModal] = useState(false);
  const handleBalance = (e) => {
    setAmountToAdd(e.target.value);
  };
  const handleBalanceChange = async (type, amount, token) => {
    const userId = localStorage.getItem('userId');
    console.log(amount);
    try {
      setLoading(true);
      let endpoint = '';
      if (type === 'plus') {
        endpoint = 'increase-balance';
      } else if (type === 'minus') {
        endpoint = 'decrease-balance';
      } else {
        setLoading(false);
        setMessage('Invalid operation type');
        setMessageModal(true);
        return;
      }

      const response = await axios.put(
        `${BaseUrl}/dashboard/${endpoint}/${userId}`,
        {
          amount,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setMessage(`Balance ${type === 'plus' ? 'increased' : 'decreased'} successfully`);
        setMessageModal(true);
        getUserBalance();
        setAmountToAdd('');
        // Optionally, you can fetch the updated balance after the change
        // getBalance(retrivedToken);
      } else {
        setLoading(false);
        setMessage(`Failed to ${type === 'plus' ? 'increase' : 'decrease'} balance`);
        setMessageModal(true);
        console.error(
          `Failed to ${type === 'plus' ? 'increase' : 'decrease'} balance:`,
          response.data.error
        );
      }
    } catch (error) {
      setLoading(false);
      setMessage('Error changing balance');
      setMessageModal(true);
      console.error('Error changing balance:', error);
    }
  };
  const UserToken = localStorage.getItem('token');
  const getUserBalance = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      const response = await axios.get(`${BaseUrl}/dashboard/balance/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        setBalance(response.data);
      } else {
        console.error('Failed to fetch user balance:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOutcomesPerWeekSum();
    getOutcomesPerMonthSum();
    getUserBalance();
    fetchOutcomes();
    const newStartDate = startDate;
    getCostumOutcomesValuePerDay(newStartDate);
    getOutcomesPerMonth();
    getAverageSpendings(SD, ED);
  }, [startDate, SD, ED]);
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField value={amountToAdd} name="Amount" label="Amount" onChange={handleBalance} />
          <Grid m={2}>
            <LoadingButton onClick={() => handleBalanceChange('plus', amountToAdd, UserToken)}>
              {' '}
              increase
            </LoadingButton>
            <LoadingButton onClick={() => handleBalanceChange('minus', amountToAdd, UserToken)}>
              {' '}
              decrease
            </LoadingButton>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="My Balance"
              total={Number(balance)}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
            />
          </Grid>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <AppWidgetSummary
              title="Spendings for this "
              total={Number(outcomeForWeek)}
              color="success"
              soustitle="week"
            />
          )}
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <AppWidgetSummary
              title="Spendings for this"
              total={outcomeFormonth}
              color="info"
              soustitle="Month"
            />
          )}
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <Grid>
              <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                <TextField
                  style={{ marginBottom: 10 }}
                  id="start-date"
                  label="Start Date"
                  type="date"
                  value={SD}
                  onChange={handleSD}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  style={{ marginBottom: 10 }}
                  id="end-date"
                  label="End Date"
                  type="date"
                  value={ED}
                  onChange={handleED}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <AppWidgetSummary
                title="Average Spending per day"
                total={Number(average)}
                color="warning"
              />
            </Grid>
          )}
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <TextField
            style={{ marginBottom: 10 }}
            id="start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {loading ? (
            <LoadingComponent />
          ) : (
            <AppWebsiteVisits
              title="Spendings per week "
              subheader="Daily Report"
              chart={{
                labels: outComeLabel,
                series: serieData || [
                  {
                    name: 'section one',
                    type: 'column',
                    fill: 'solid',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <AppCurrentVisits
              title="How do I spend my money"
              chart={{
                series: outcomes || [
                  { label: 'section one', value: 135 },
                  { label: 'section two', value: 175 },
                  { label: 'section three', value: 234 },
                  { label: 'section four', value: 443 },
                  { label: 'section five', value: 15 },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <AppConversionRates
              title="Outcomes for this week"
              subheader="(+43%) than last year"
              chart={{
                series: outcomesMonth || [
                  { label: 'section one', value: 135 },
                  { label: 'section two', value: 175 },
                  { label: 'section three', value: 234 },
                  { label: 'section four', value: 443 },
                  { label: 'section five', value: 15 },
                ],
              }}
            />
          )}
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Finantial Goals"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}
      </Grid>
      <MessageModal open={messageModal} text={message} handleClose={() => setMessageModal(false)} />
    </Container>
  );
}
