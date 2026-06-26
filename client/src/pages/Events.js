import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  Chip
} from '@mui/material';
import { Event as EventIcon, LocationOn, CalendarToday } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
  const res = await axios.get('/api/events');
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesTag = !filters.type ||
      (event.tags || []).some(tag => tag.toLowerCase().includes(filters.type.toLowerCase()));
    const matchesLocation = !filters.location ||
      (event.location || '').toLowerCase().includes(filters.location.toLowerCase());
    const matchesSearch = !filters.search ||
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesTag && matchesLocation && matchesSearch;
  });

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Events
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Tag"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={4}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {event.title}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {event.location || 'Location TBD'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {(event.tags || []).map((tag, i) => (
                    <Chip key={i} label={tag} size="small" sx={{ mr: 1, mb: 0.5 }} />
                  ))}
                  <Chip
                    label={`${event.attendees?.length || 0} attendees`}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate(`/events/${event._id}`)}>
                  Learn More
                </Button>
                <Button size="small" color="primary" onClick={() => navigate(`/events/${event._id}`)}>
                  Register
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Events; 