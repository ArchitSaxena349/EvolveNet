import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    skills: []
  });
  const [openExperience, setOpenExperience] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const [educationForm, setEducationForm] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use auth/me which returns the current user's info
        const res = await axios.get('/api/auth/me');
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          bio: res.data.profile?.bio || '',
          location: res.data.profile?.location || '',
          skills: res.data.profile?.skills || []
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update name/email/password via /api/users/profile
      const payload = {
        name: formData.name,
        email: profile.email
      };
      // If user provided a password field in formData, include it (not present in current form)
      if (formData.password) payload.password = formData.password;

      const res = await axios.put('/api/users/profile', payload);
      // server returns updated user
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/profile/experience', experienceForm);
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          experience: res.data
        }
      });
      setOpenExperience(false);
      setExperienceForm({
        title: '',
        company: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
      });
    } catch (err) {
      console.error('Error adding experience:', err);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/profile/education', educationForm);
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          education: res.data
        }
      });
      setOpenEducation(false);
      setEducationForm({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
      });
    } catch (err) {
      console.error('Error adding education:', err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/profile/skills', { skill: newSkill });
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          skills: res.data
        }
      });
      setOpenSkill(false);
      setNewSkill('');
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  const handleDeleteSkill = async (skill) => {
    try {
      const res = await axios.put('/api/users/profile/skills', { skill, action: 'delete' });
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          skills: res.data
        }
      });
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

    if (!profile) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={profile.profile?.picture}
                  sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                  <Typography variant="h4" component="h1">
                    {profile.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {profile.email}
                  </Typography>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(!editing)}
                    sx={{ mt: 1 }}
                  >
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>
              </Box>

              {editing ? (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <>
                  <Typography paragraph>
                    {profile.profile?.bio || 'No bio available'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1 }} />
                    <Typography>
                      {profile.profile?.location || 'Location not specified'}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Content */}
        <Grid item xs={12}>
          <Card>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Experience" />
              <Tab label="Education" />
              <Tab label="Skills" />
              <Tab label="Connections" />
            </Tabs>

            <CardContent>
              {tabValue === 0 && (
                <Box>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenExperience(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Experience
                  </Button>
                  {profile.profile?.experience?.map((exp, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="h6">{exp.title}</Typography>
                      <Typography color="text.secondary">
                        {exp.company} • {exp.location}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(exp.from).toLocaleDateString()} -{' '}
                        {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}
                      </Typography>
                      <Typography paragraph>{exp.description}</Typography>
                      {index < profile.profile.experience.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenEducation(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Education
                  </Button>
                  {profile.profile?.education?.map((edu, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="h6">{edu.school}</Typography>
                      <Typography color="text.secondary">
                        {edu.degree} in {edu.fieldofstudy}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(edu.from).toLocaleDateString()} -{' '}
                        {edu.current ? 'Present' : new Date(edu.to).toLocaleDateString()}
                      </Typography>
                      <Typography paragraph>{edu.description}</Typography>
                      {index < profile.profile.education.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSkill(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Skill
                  </Button>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.profile?.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleDeleteSkill(skill)}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {profile.connections?.length || 0} Connections
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.connections?.map((connection) => (
                      <Grid item xs={12} sm={6} md={4} key={connection._id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={connection.profile?.picture}
                                sx={{ mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {connection.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {connection.profile?.title || 'No title'}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Experience Dialog */}
      <Dialog open={openExperience} onClose={() => setOpenExperience(false)}>
        <DialogTitle>Add Experience</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddExperience}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={experienceForm.title}
              onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={experienceForm.company}
              onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={experienceForm.location}
              onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="From Date"
              name="from"
              type="date"
              value={experienceForm.from}
              onChange={(e) => setExperienceForm({ ...experienceForm, from: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="To Date"
              name="to"
              type="date"
              value={experienceForm.to}
              onChange={(e) => setExperienceForm({ ...experienceForm, to: e.target.value })}
              margin="normal"
              disabled={experienceForm.current}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="checkbox"
                checked={experienceForm.current}
                onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
              />
              <Typography sx={{ ml: 1 }}>Current Job</Typography>
            </Box>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={experienceForm.description}
              onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
              margin="normal"
            />
            <DialogActions>
              <Button onClick={() => setOpenExperience(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={openEducation} onClose={() => setOpenEducation(false)}>
        <DialogTitle>Add Education</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddEducation}>
            <TextField
              fullWidth
              label="School"
              name="school"
              value={educationForm.school}
              onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Degree"
              name="degree"
              value={educationForm.degree}
              onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Field of Study"
              name="fieldofstudy"
              value={educationForm.fieldofstudy}
              onChange={(e) => setEducationForm({ ...educationForm, fieldofstudy: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="From Date"
              name="from"
              type="date"
              value={educationForm.from}
              onChange={(e) => setEducationForm({ ...educationForm, from: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="To Date"
              name="to"
              type="date"
              value={educationForm.to}
              onChange={(e) => setEducationForm({ ...educationForm, to: e.target.value })}
              margin="normal"
              disabled={educationForm.current}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="checkbox"
                checked={educationForm.current}
                onChange={(e) => setEducationForm({ ...educationForm, current: e.target.checked })}
              />
              <Typography sx={{ ml: 1 }}>Currently Studying</Typography>
            </Box>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={educationForm.description}
              onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
              margin="normal"
            />
            <DialogActions>
              <Button onClick={() => setOpenEducation(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skill Dialog */}
      <Dialog open={openSkill} onClose={() => setOpenSkill(false)}>
        <DialogTitle>Add Skill</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddSkill}>
            <TextField
              fullWidth
              label="Skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              margin="normal"
              required
            />
            <DialogActions>
              <Button onClick={() => setOpenSkill(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Profile; 