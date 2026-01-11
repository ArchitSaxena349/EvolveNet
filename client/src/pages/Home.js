import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Assuming public endpoint or handled gracefully if 401. 
        // Actually /api/events is protected. We might need a public one or just handle the error.
        // If protected, we can check if user is logged in, or if we want to show teasers to guests we'd need a public endpoint.
        // For now, let's only fetch if user might be logged in, or just handle the catch block silently.
        // Wait, if /api/events is protected, guests won't see anything.
        // Let's create a "Public" view maybe? Or just show static content if not logged in.
        // The request is to improve Home page UX. 
        // Let's try to fetch, if 401, we just don't show events.
        const res = await axios.get('/api/events');
        setEvents(res.data.slice(0, 3));
      } catch (err) {
        // ignore 401s
      }
    };
    fetchEvents();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to EvolveNet
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with professionals, discover opportunities, and grow your network
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {events.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Upcoming Events
          </Typography>
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item xs={12} md={4} key={event._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Typography>
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      {event.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>View Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Home; 