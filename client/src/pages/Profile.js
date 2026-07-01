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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  EmojiEvents as SkillsIcon,
  People as PeopleIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EmptyState = ({ icon, text }) => (
  <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
    <Box sx={{ opacity: 0.4, mb: 1, '& svg': { fontSize: 48 } }}>{icon}</Box>
    <Typography color="text.secondary">{text}</Typography>
  </Box>
);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  const experience = profile.profile?.experience || [];
  const education = profile.profile?.education || [];
  const skills = profile.profile?.skills || [];
  const connections = profile.connections || [];
  const initial = (profile.name || 'U').trim().charAt(0).toUpperCase();

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden', '&:hover': { transform: 'none' } }}>
            {/* Cover banner */}
            <Box
              sx={{
                height: 140,
                backgroundImage:
                  'linear-gradient(135deg, #4f46e5 0%, #6d28d9 55%, #06b6d4 130%)',
              }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  gap: 2,
                  mt: '-56px',
                  mb: 3,
                }}
              >
                <Avatar
                  src={profile.profile?.picture}
                  sx={{
                    width: 112,
                    height: 112,
                    border: '4px solid',
                    borderColor: 'background.paper',
                    bgcolor: 'secondary.main',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    boxShadow: 2,
                  }}
                >
                  {initial}
                </Avatar>
                <Box sx={{ flexGrow: 1, pb: 0.5 }}>
                  <Typography variant="h4" component="h1">
                    {profile.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 0.5, color: 'text.secondary', flexWrap: 'wrap' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">{profile.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationIcon fontSize="small" />
                      <Typography variant="body2">
                        {profile.profile?.location || 'Location not specified'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Button
                  variant={editing ? 'outlined' : 'contained'}
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              {editing ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
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
                      <Button type="submit" variant="contained" color="primary">
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  <Typography color={profile.profile?.bio ? 'text.primary' : 'text.secondary'}>
                    {profile.profile?.bio || 'No bio available yet. Click “Edit Profile” to add one.'}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                    <Chip icon={<WorkIcon />} label={`${experience.length} Experience`} variant="outlined" />
                    <Chip icon={<SkillsIcon />} label={`${skills.length} Skills`} variant="outlined" />
                    <Chip icon={<PeopleIcon />} label={`${connections.length} Connections`} variant="outlined" />
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Content */}
        <Grid item xs={12}>
          <Card sx={{ '&:hover': { transform: 'none' } }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}
            >
              <Tab icon={<WorkIcon />} iconPosition="start" label="Experience" />
              <Tab icon={<SchoolIcon />} iconPosition="start" label="Education" />
              <Tab icon={<SkillsIcon />} iconPosition="start" label="Skills" />
              <Tab icon={<PeopleIcon />} iconPosition="start" label="Connections" />
            </Tabs>

            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {tabValue === 0 && (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenExperience(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Experience
                  </Button>
                  {experience.length === 0 ? (
                    <EmptyState icon={<WorkIcon />} text="No experience added yet." />
                  ) : (
                    <Stack spacing={2}>
                      {experience.map((exp, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(79,70,229,0.1)', color: 'primary.main' }}>
                              <WorkIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6">{exp.title}</Typography>
                              <Typography color="text.secondary">
                                {exp.company}
                                {exp.location ? ` • ${exp.location}` : ''}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {formatDate(exp.from)} — {exp.current ? 'Present' : formatDate(exp.to)}
                              </Typography>
                              {exp.description && (
                                <Typography sx={{ mt: 1 }}>{exp.description}</Typography>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenEducation(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Education
                  </Button>
                  {education.length === 0 ? (
                    <EmptyState icon={<SchoolIcon />} text="No education added yet." />
                  ) : (
                    <Stack spacing={2}>
                      {education.map((edu, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(6,182,212,0.12)', color: 'secondary.dark' }}>
                              <SchoolIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6">{edu.school}</Typography>
                              <Typography color="text.secondary">
                                {edu.degree}
                                {edu.fieldofstudy ? ` in ${edu.fieldofstudy}` : ''}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {formatDate(edu.from)} — {edu.current ? 'Present' : formatDate(edu.to)}
                              </Typography>
                              {edu.description && (
                                <Typography sx={{ mt: 1 }}>{edu.description}</Typography>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSkill(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Skill
                  </Button>
                  {skills.length === 0 ? (
                    <EmptyState icon={<SkillsIcon />} text="No skills added yet." />
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="primary"
                          variant="outlined"
                          onDelete={() => handleDeleteSkill(skill)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {connections.length} Connections
                  </Typography>
                  {connections.length === 0 ? (
                    <EmptyState icon={<PeopleIcon />} text="No connections yet." />
                  ) : (
                    <Grid container spacing={2}>
                      {connections.map((connection) => (
                        <Grid item xs={12} sm={6} md={4} key={connection._id}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                src={connection.profile?.picture}
                                sx={{ bgcolor: 'primary.main' }}
                              >
                                {(connection.name || 'U').trim().charAt(0).toUpperCase()}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle1" noWrap>
                                  {connection.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {connection.profile?.title || 'No title'}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Experience Dialog */}
      <Dialog open={openExperience} onClose={() => setOpenExperience(false)} fullWidth maxWidth="sm">
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={experienceForm.current}
                  onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                />
              }
              label="Current Job"
            />
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
      <Dialog open={openEducation} onClose={() => setOpenEducation(false)} fullWidth maxWidth="sm">
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={educationForm.current}
                  onChange={(e) => setEducationForm({ ...educationForm, current: e.target.checked })}
                />
              }
              label="Currently Studying"
            />
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
      <Dialog open={openSkill} onClose={() => setOpenSkill(false)} fullWidth maxWidth="xs">
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
