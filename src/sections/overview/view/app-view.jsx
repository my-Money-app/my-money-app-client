import axios from 'axios';
import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [outcomeForWeek, setOutcomeForWeek] = useState();
  const [outcomeFormonth, setOutcomeFormonth] = useState();

  const getOutcomesPerWeekSum = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(`http://localhost:3120/dashboard/sum-for-week/${userId}`, {
        headers: {
          Authorization: `${token}`, // Include the token in the Authorization header
        },
        iid: userId,
      });

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        setOutcomeForWeek(response.data.totalValueForWeek);
        console.log(response.data.totalValueForWeek);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
    }
  };
  const getOutcomesPerMonthSum = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(`http://localhost:3120/dashboard/sum-for-month/${userId}`, {
        headers: {
          Authorization: `${token}`, // Include the token in the Authorization header
        },
        iid: userId,
      });

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        setOutcomeFormonth(response.data);
        console.log(response.data);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
    }
  };

  // outcomes value per day
  const [outComeLabel, setOutcomeLabel] = useState();
  const [serieData, setSerieData] = useState();
  const getOutcomesValuePerDay = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(`http://localhost:3120/dashboard/perday/${userId}`, {
        headers: {
          Authorization: `${token}`, // Include the token in the Authorization header
        },
        iid: userId,
      });

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
        console.log('ser', seriesData);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
    }
  };

  // get outcomes
  const [outcomes, setOutcomes] = useState();
  const fetchOutcomes = async () => {
    try {
      // Retrieve the user ID from localStorage
      const userId = localStorage.getItem('userId');

      // If user ID is not found in localStorage, handle the error
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      // Make a GET request to fetch outcomes for the user
      const response = await axios.get(`http://localhost:3120/outcomes/${userId}`);

      // Update the outcomes state with the fetched data
      const seriesData = response.data.map((outcome) => ({
        label: outcome.name,
        value: outcome.value,
      }));
      setOutcomes(seriesData);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  };

  useEffect(() => {
    getOutcomesPerWeekSum();
    getOutcomesPerMonthSum();
    getOutcomesValuePerDay();
    fetchOutcomes();
  }, []);
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Spendings for this "
            total={Number(outcomeForWeek)}
            color="success"
            soustitle="week"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Spendings for this"
            total={outcomeFormonth}
            color="info"
            soustitle="Month"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="section two outcomes"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="section three outcomes"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Current week spendings"
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
        </Grid>

        <Grid xs={12} md={6} lg={4}>
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
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Outcomes for this week"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'section one', value: 135 },
                { label: 'section two', value: 175 },
                { label: 'section three', value: 234 },
                { label: 'section four', value: 443 },
                { label: 'section five', value: 15 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
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
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
