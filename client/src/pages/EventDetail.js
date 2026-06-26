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
  Alert
} from '@mui/material';
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
    <Container sx={{ py: 6, textAlign: 'center' }}>
      <CircularProgress />
    </Container>
  );

  if (!event) return (
    <Container sx={{ py: 6 }}>
      <Typography>Event not found.</Typography>
    </Container>
  );

  // Attendees come back populated as objects ({ _id, name, ... }) but locally
  // we append the bare user id, so normalise both sides before comparing.
  const attendeeId = (a) => String(a?._id || a);
  const isRegistered = event.attendees?.some(a => attendeeId(a) === String(user?.id));

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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">{event.title}</Typography>
            <Box>
              {(event.tags || []).map((tag, i) => (
                <Chip key={i} label={tag} sx={{ mr: 1 }} />
              ))}
              <Chip label={`${event.attendees?.length || 0} attendees`} />
            </Box>
          </Box>

          <Typography paragraph>{event.description}</Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Date: {event.date ? new Date(event.date).toLocaleString() : 'TBD'}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Location: {event.location || 'TBD'}
          </Typography>

          <Box sx={{ mt: 3 }}>
            {user ? (
              isRegistered ? (
                <Button variant="outlined" color="secondary" onClick={handleUnregister}>Unregister</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleRegister}>Register</Button>
              )
            ) : (
              <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Login to Register</Button>
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
