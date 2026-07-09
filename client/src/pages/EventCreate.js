import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Stack,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
} from '@mui/icons-material';

const EventCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: '',
    tags: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
    setFieldErrors((current) => ({ ...current, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nextErrors = {};
    const title = formData.title.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const tags = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    const maxAttendees = Number(formData.maxAttendees);

    if (!title) nextErrors.title = 'Title is required';
    else if (title.length < 2 || title.length > 120) nextErrors.title = 'Title must be 2 to 120 characters';

    if (!description) nextErrors.description = 'Description is required';
    else if (description.length < 10 || description.length > 2000) nextErrors.description = 'Description must be 10 to 2000 characters';

    if (!formData.date) nextErrors.date = 'Date is required';
    if (!location) nextErrors.location = 'Location is required';
    else if (location.length < 2 || location.length > 120) nextErrors.location = 'Location must be 2 to 120 characters';

    if (!Number.isInteger(maxAttendees) || maxAttendees < 1) nextErrors.maxAttendees = 'Enter a valid attendee limit';
    if (tags.length === 0) nextErrors.tags = 'Add at least one tag';

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/events', {
        title,
        description,
        date: formData.date,
        location,
        maxAttendees,
        tags,
      });
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Unable to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/events')} sx={{ mb: 2 }}>
        Back to Events
      </Button>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 3, md: 4 }, color: 'common.white', backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 55%, #06b6d4 130%)' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <EventIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                Create Event
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Share a workshop, meetup, or campus opportunity with your network.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {error && (
            <Box sx={{ mb: 2, color: 'error.main' }}>{error}</Box>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} error={Boolean(fieldErrors.title)} helperText={fieldErrors.title} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} error={Boolean(fieldErrors.description)} helperText={fieldErrors.description} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Date" name="date" type="datetime-local" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} error={Boolean(fieldErrors.date)} helperText={fieldErrors.date} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} error={Boolean(fieldErrors.location)} helperText={fieldErrors.location} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Max Attendees" name="maxAttendees" type="number" inputProps={{ min: 1 }} value={formData.maxAttendees} onChange={handleChange} error={Boolean(fieldErrors.maxAttendees)} helperText={fieldErrors.maxAttendees} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Tags" name="tags" value={formData.tags} onChange={handleChange} error={Boolean(fieldErrors.tags)} helperText={fieldErrors.tags || 'Comma separated, e.g. workshop, career, alumni'} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Event'}
                  </Button>
                  <Button variant="text" onClick={() => navigate('/events')}>Cancel</Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EventCreate;