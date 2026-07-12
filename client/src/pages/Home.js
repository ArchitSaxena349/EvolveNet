import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Event as EventIcon,
  Insights as InsightsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: <GroupsIcon fontSize="large" />,
    title: 'Build Your Network',
    text: 'Connect with professionals who share your goals and grow meaningful relationships.',
  },
  {
    icon: <EventIcon fontSize="large" />,
    title: 'Discover Events',
    text: 'Find and join events, workshops, and meetups tailored to your interests.',
  },
  {
    icon: <InsightsIcon fontSize="large" />,
    title: 'Grow Your Career',
    text: 'Join groups, share opportunities, and stay ahead in your field.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data.slice(0, 3));
      } catch (err) {
        // ignore 401s — events are shown only when available
      }
    };
    fetchEvents();
  }, []);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          color: 'common.white',
          backgroundImage:
            'linear-gradient(135deg, #4f46e5 0%, #6d28d9 50%, #0e7490 100%)',
        }}
      >
        {/* decorative glow */}
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(34,211,238,0) 70%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 8, md: 12 } }}>
          <Box sx={{ maxWidth: 720 }}>
            <Chip
              label="Professional networking, reimagined"
              sx={{
                mb: 3,
                color: 'common.white',
                bgcolor: 'rgba(255,255,255,0.15)',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 800, fontSize: { xs: '2.4rem', md: '3.5rem' } }}
            >
              Grow your network. Evolve your career.
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, mb: 4 }}>
              Connect with professionals, discover opportunities, and build the
              relationships that move your career forward — all in one place.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {user ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/profile')}
                    sx={{ fontWeight: 700 }}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/connections')}
                    sx={{
                      color: 'common.white',
                      borderColor: 'rgba(255,255,255,0.6)',
                      '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    Explore Network
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/register')}
                    sx={{ fontWeight: 700 }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: 'common.white',
                      borderColor: 'rgba(255,255,255,0.6)',
                      '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Features */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        color: 'primary.main',
                        bgcolor: 'rgba(79,70,229,0.1)',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">{feature.text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Upcoming events */}
        {events.length > 0 && (
          <Box sx={{ pb: { xs: 8, md: 12 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                mb: 4,
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="h4">Upcoming Events</Typography>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/events')}>
                View all
              </Button>
            </Box>
            <Grid container spacing={4}>
              {events.map((event) => (
                <Grid item xs={12} md={4} key={event._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Chip
                        label={event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1.5 }}
                      />
                      <Typography gutterBottom variant="h6" component="h2">
                        {event.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {event.description
                          ? `${event.description.substring(0, 100)}${event.description.length > 100 ? '…' : ''}`
                          : ''}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/events/${event._id}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;
