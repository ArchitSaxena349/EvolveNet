import React, { useState, useEffect, useContext } from 'react';
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
  MenuItem,
  Chip
} from '@mui/material';
import { Event as EventIcon, LocationOn, CalendarToday } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesType = !filters.type || event.type === filters.type;
    const matchesLocation = !filters.location || 
      (event.location.type === 'physical' && 
       event.location.city.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesSearch = !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesType && matchesLocation && matchesSearch;
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
              select
              fullWidth
              label="Event Type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="conference">Conference</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="webinar">Webinar</MenuItem>
              <MenuItem value="networking">Networking</MenuItem>
            </TextField>
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
                    {new Date(event.startDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {event.location.type === 'physical'
                      ? `${event.location.city}, ${event.location.country}`
                      : 'Virtual Event'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={event.type}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${event.attendees.length} attendees`}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate(`/events/${event._id}`)}>
                  Learn More
                </Button>
                <Button size="small" color="primary">
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