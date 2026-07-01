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
  Chip,
  Paper,
  Stack,
  CircularProgress,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  CalendarToday,
  Search as SearchIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          <EventIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1">
            Events
          </Typography>
          <Typography color="text.secondary">
            Discover workshops, meetups, and opportunities near you
          </Typography>
        </Box>
      </Stack>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, mt: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Tag"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <EventIcon sx={{ fontSize: 56, opacity: 0.4, mb: 1 }} />
          <Typography>No events match your filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'rgba(79,70,229,0.1)', color: 'primary.main' }}>
                      <EventIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2">
                      {event.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {event.location || 'Location TBD'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(event.tags || []).map((tag, i) => (
                      <Chip key={i} label={tag} size="small" color="primary" variant="outlined" />
                    ))}
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${event.attendees?.length || 0}`}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View & Register
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Events;
