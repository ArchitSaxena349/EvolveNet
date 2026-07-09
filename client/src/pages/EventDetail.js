import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setSnack({ open: true, message: 'Failed to load event', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
      <CircularProgress />
    </Box>
  );

  if (!event) return (
    <Container sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>Event not found.</Typography>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/events')}>
        Back to Events
      </Button>
    </Container>
  );

  // Attendees come back populated as objects ({ _id, name, ... }) but locally
  // we append the bare user id, so normalise both sides before comparing.
  const attendeeId = (a) => String(a?._id || a);
  const isRegistered = event.attendees?.some(a => attendeeId(a) === String(user?.id));
  const isOrganizer = String(event.organizer?._id || event.organizer) === String(user?.id);

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    try {
      await axios.post(`/api/events/${event._id}/register`);
      setEvent({ ...event, attendees: [...(event.attendees || []), user.id] });
      setSnack({ open: true, message: 'Registered successfully', severity: 'success' });
    } catch (err) {
      console.error('Register error:', err);
      setSnack({ open: true, message: err.response?.data?.error || 'Register failed', severity: 'error' });
    }
  };

  const handleUnregister = async () => {
    if (!user) return navigate('/login');
    try {
      await axios.delete(`/api/events/${event._id}/register`);
      setEvent({ ...event, attendees: event.attendees.filter(a => attendeeId(a) !== String(user.id)) });
      setSnack({ open: true, message: 'Unregistered successfully', severity: 'success' });
    } catch (err) {
      console.error('Unregister error:', err);
      setSnack({ open: true, message: err.response?.data?.error || 'Unregister failed', severity: 'error' });
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Delete this event permanently?')) return;

    try {
      await axios.delete(`/api/events/${event._id}`);
      setSnack({ open: true, message: 'Event deleted successfully', severity: 'success' });
      navigate('/events');
    } catch (err) {
      console.error('Delete event error:', err);
      setSnack({ open: true, message: err.response?.data?.error || 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/events')}
        sx={{ mb: 2 }}
      >
        Back to Events
      </Button>

      <Card sx={{ overflow: 'hidden', '&:hover': { transform: 'none' } }}>
        {/* Gradient banner */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            color: 'common.white',
            backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 55%, #06b6d4 130%)',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            {event.title}
          </Typography>
          {isRegistered && (
            <Chip
              icon={<CheckCircleIcon />}
              label="You're registered"
              size="small"
              sx={{ mt: 1.5, color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' }}
            />
          )}
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
            {(event.tags || []).map((tag, i) => (
              <Chip key={i} label={tag} color="primary" variant="outlined" size="small" />
            ))}
            <Chip icon={<PeopleIcon />} label={`${event.attendees?.length || 0} attendees`} size="small" />
          </Box>

          <Typography paragraph>{event.description}</Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
              <CalendarToday fontSize="small" />
              <Typography>{event.date ? new Date(event.date).toLocaleString() : 'Date TBD'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
              <LocationOn fontSize="small" />
              <Typography>{event.location || 'Location TBD'}</Typography>
            </Box>
          </Stack>

          <Box>
            {user ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {isRegistered ? (
                  <Button variant="outlined" color="error" size="large" onClick={handleUnregister}>Unregister</Button>
                ) : (
                  <Button variant="contained" color="primary" size="large" onClick={handleRegister}>Register</Button>
                )}
                {isOrganizer && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<DeleteForeverIcon />}
                    onClick={handleDeleteEvent}
                  >
                    Delete Event
                  </Button>
                )}
              </Stack>
            ) : (
              <Button variant="contained" color="primary" size="large" onClick={() => navigate('/login')}>Login to Register</Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetail;
