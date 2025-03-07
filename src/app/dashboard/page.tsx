import * as React from 'react';
import { Grid, Typography } from '@mui/material';

// import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { Sales } from '@/components/dashboard/overview/sales';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` };

function getGreeting(): string {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return '🌅 Good morning';
  }
  if (hours < 18) {
    return '🌞 Good afternoon';
  }
  return '🌜 Good evening';
}

export default function Page(): React.JSX.Element {
  const greeting = getGreeting();
  const chartSeries = [{ name: 'This year', data: [0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0] }];

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          fontWeight: '500',
          mb: 5,
        }}
      >
        Hi, Hon. Seyi. {greeting}
      </Typography>
      <Grid
        container
        sx={{
          width: '100%',
          overflowX: 'auto',
          // Ensure scrolling on small devices
          overflowY: { xs: 'scroll', sm: 'visible' },
          '-webkit-overflow-scrolling': 'touch', // Enable momentum scrolling on iOS
          '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbars
        }}
      >
        <Grid item xs={12}>
          <Sales chartSeries={chartSeries} />
        </Grid>
      </Grid>
    </>
  );
}
