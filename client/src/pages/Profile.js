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
  PhotoCamera as PhotoCameraIcon,
  DeleteOutline as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ icon, text }) => (
  <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
    <Box sx={{ opacity: 0.4, mb: 1, '& svg': { fontSize: 48 } }}>{icon}</Box>
    <Typography color="text.secondary">{text}</Typography>
  </Box>
);

const resizeImage = (file, width, height) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file.'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('Images must be smaller than 8 MB.'));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      const scale = Math.max(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('The selected image could not be read.'));
    };
    image.src = objectUrl;
  });

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [editing, setEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileErrors, setProfileErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    picture: '',
    coverPhoto: '',
    skills: []
  });
  const [imageError, setImageError] = useState('');
  const [openExperience, setOpenExperience] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const [experienceErrors, setExperienceErrors] = useState({});
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const [educationErrors, setEducationErrors] = useState({});
  const [educationForm, setEducationForm] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const [skillError, setSkillError] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // The profile and accepted connections are stored behind separate APIs.
        const [profileRes, connectionsRes] = await Promise.all([
          axios.get('/api/auth/me'),
          axios.get('/api/connections')
        ]);
        const res = profileRes;
        setProfile(res.data);
        setConnections(connectionsRes.data);
        setFormData({
          name: res.data.name,
          bio: res.data.profile?.bio || '',
          location: res.data.profile?.location || '',
          picture: res.data.profile?.picture || '',
          coverPhoto: res.data.profile?.coverPhoto || '',
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

  const handleRemoveConnection = async (connectionId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;

    try {
      await axios.delete(`/api/connections/${connectionId}`);
      setConnections((current) => current.filter((connection) => connection._id !== connectionId));
    } catch (err) {
      console.error('Error removing connection:', err);
      window.alert(err.response?.data?.error || 'Unable to remove this connection.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setProfileErrors((current) => ({ ...current, [e.target.name]: undefined }));
  };

  const handleImageChange = async (event, field) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setImageError('');
      const image =
        field === 'picture'
          ? await resizeImage(file, 512, 512)
          : await resizeImage(file, 1600, 500);
      setFormData((current) => ({ ...current, [field]: image }));
    } catch (err) {
      setImageError(err.message);
    }
  };

  const toggleEditing = () => {
    if (editing) {
      setFormData((current) => ({
        ...current,
        name: profile.name,
        bio: profile.profile?.bio || '',
        location: profile.profile?.location || '',
        picture: profile.profile?.picture || '',
        coverPhoto: profile.profile?.coverPhoto || ''
      }));
      setImageError('');
      setProfileErrors({});
    }
    setEditing((current) => !current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextProfileErrors = {};

    if (!formData.name.trim()) {
      nextProfileErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      nextProfileErrors.name = 'Name must be 2 to 50 characters';
    }

    if (formData.location && formData.location.trim().length > 100) {
      nextProfileErrors.location = 'Location must be 100 characters or less';
    }

    if (formData.bio && formData.bio.trim().length > 500) {
      nextProfileErrors.bio = 'Bio must be 500 characters or less';
    }

    if (Object.keys(nextProfileErrors).length > 0) {
      setProfileErrors(nextProfileErrors);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: profile.email,
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        picture: formData.picture,
        coverPhoto: formData.coverPhoto
      };
      if (formData.password) payload.password = formData.password;

      const res = await axios.put('/api/users/profile', payload);
      setProfile(res.data);
      setEditing(false);
      setProfileErrors({});
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const nextExperienceErrors = {};

    if (!experienceForm.title.trim()) nextExperienceErrors.title = 'Title is required';
    if (!experienceForm.company.trim()) nextExperienceErrors.company = 'Company is required';
    if (!experienceForm.from) nextExperienceErrors.from = 'Start date is required';
    if (!experienceForm.current && !experienceForm.to) nextExperienceErrors.to = 'End date is required unless this is current';
    if (experienceForm.description && experienceForm.description.length > 500) {
      nextExperienceErrors.description = 'Description must be 500 characters or less';
    }

    if (Object.keys(nextExperienceErrors).length > 0) {
      setExperienceErrors(nextExperienceErrors);
      return;
    }

    try {
      const res = await axios.put('/api/users/profile/experience', {
        ...experienceForm,
        title: experienceForm.title.trim(),
        company: experienceForm.company.trim(),
        location: experienceForm.location.trim(),
        description: experienceForm.description.trim()
      });
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
      setExperienceErrors({});
    } catch (err) {
      console.error('Error adding experience:', err);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    const nextEducationErrors = {};

    if (!educationForm.school.trim()) nextEducationErrors.school = 'School is required';
    if (!educationForm.degree.trim()) nextEducationErrors.degree = 'Degree is required';
    if (!educationForm.fieldofstudy.trim()) nextEducationErrors.fieldofstudy = 'Field of study is required';
    if (!educationForm.from) nextEducationErrors.from = 'Start date is required';
    if (!educationForm.current && !educationForm.to) nextEducationErrors.to = 'End date is required unless currently studying';
    if (educationForm.description && educationForm.description.length > 500) {
      nextEducationErrors.description = 'Description must be 500 characters or less';
    }

    if (Object.keys(nextEducationErrors).length > 0) {
      setEducationErrors(nextEducationErrors);
      return;
    }

    try {
      const res = await axios.put('/api/users/profile/education', {
        ...educationForm,
        school: educationForm.school.trim(),
        degree: educationForm.degree.trim(),
        fieldofstudy: educationForm.fieldofstudy.trim(),
        description: educationForm.description.trim()
      });
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
      setEducationErrors({});
    } catch (err) {
      console.error('Error adding education:', err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) {
      setSkillError('Skill is required');
      return;
    }
    if (newSkill.trim().length < 2 || newSkill.trim().length > 50) {
      setSkillError('Skill must be 2 to 50 characters');
      return;
    }

    try {
      const res = await axios.put('/api/users/profile/skills', { skill: newSkill.trim() });
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          skills: res.data
        }
      });
      setOpenSkill(false);
      setNewSkill('');
      setSkillError('');
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

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      const res = await axios.delete(`/api/users/profile/experience/${experienceId}`);
      setProfile((current) => ({
        ...current,
        profile: { ...current.profile, experience: res.data }
      }));
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      const res = await axios.delete(`/api/users/profile/education/${educationId}`);
      setProfile((current) => ({
        ...current,
        profile: { ...current.profile, education: res.data }
      }));
    } catch (err) {
      console.error('Error deleting education:', err);
    }
  };

  const handleClearProfile = async () => {
    if (!window.confirm('Remove all profile details, photos, skills, experience, and education?')) return;
    try {
      const res = await axios.delete('/api/users/profile/content');
      setProfile(res.data);
      setFormData((current) => ({
        ...current,
        bio: '',
        location: '',
        picture: '',
        coverPhoto: '',
        skills: []
      }));
    } catch (err) {
      console.error('Error clearing profile:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/users/profile');
      setOpenDeleteAccount(false);
      logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error deleting account:', err);
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
  const currentUserId = profile?.id || profile?._id || user?.id || user?._id;
  const connectionUsers = connections
    .map((connection) => ({
      connectionId: connection._id,
      user: connection.user?._id === currentUserId ? connection.connectedUser : connection.user
    }))
    .filter(({ user: connectionUser }) => connectionUser);
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
                position: 'relative',
                backgroundImage: formData.coverPhoto
                  ? `url(${formData.coverPhoto})`
                  : 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 55%, #06b6d4 130%)',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              {editing && (
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: 16, top: 16 }}>
                  {formData.coverPhoto && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => setFormData((current) => ({ ...current, coverPhoto: '' }))}
                    >
                      Remove
                    </Button>
                  )}
                  <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={<PhotoCameraIcon />}
                  >
                    Change cover
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageChange(event, 'coverPhoto')}
                    />
                  </Button>
                </Stack>
              )}
            </Box>
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
                  src={formData.picture}
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
                {editing && (
                  <Stack spacing={1} sx={{ mb: 0.5 }}>
                    <Button
                      component="label"
                      variant="contained"
                      size="small"
                      startIcon={<PhotoCameraIcon />}
                    >
                      Change photo
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImageChange(event, 'picture')}
                      />
                    </Button>
                    {formData.picture && (
                      <Button
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setFormData((current) => ({ ...current, picture: '' }))}
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                )}
                <Box sx={{ flexGrow: 1, minWidth: 0, pb: 0.5 }}>
                  <Typography variant="h4" component="h1" sx={{ overflowWrap: 'anywhere' }}>
                    {profile.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 0.5, color: 'text.secondary', flexWrap: 'wrap' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{profile.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
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
                  onClick={toggleEditing}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              {editing ? (
                <Box component="form" onSubmit={handleSubmit}>
                  {imageError && (
                    <Typography color="error" sx={{ mb: 2 }}>
                      {imageError}
                    </Typography>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={Boolean(profileErrors.name)}
                        helperText={profileErrors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={Boolean(profileErrors.location)}
                        helperText={profileErrors.location}
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
                        error={Boolean(profileErrors.bio)}
                        helperText={profileErrors.bio}
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
                  <Stack
                    direction="row"
                    spacing={1.5}
                    useFlexGap
                    sx={{ mt: 2.5, flexWrap: 'wrap' }}
                  >
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
                      {experience.map((exp) => (
                        <Paper key={exp._id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(79,70,229,0.1)', color: 'primary.main' }}>
                              <WorkIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
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
                            <Button
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteExperience(exp._id)}
                              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                            >
                              Delete
                            </Button>
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
                      {education.map((edu) => (
                        <Paper key={edu._id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(6,182,212,0.12)', color: 'secondary.dark' }}>
                              <SchoolIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
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
                            <Button
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteEducation(edu._id)}
                              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                            >
                              Delete
                            </Button>
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
                    {connectionUsers.length} Connections
                  </Typography>
                  {connectionUsers.length === 0 ? (
                    <EmptyState icon={<PeopleIcon />} text="No connections yet." />
                  ) : (
                    <Grid container spacing={2}>
                      {connectionUsers.map(({ connectionId, user: connection }) => (
                        <Grid item xs={12} sm={6} md={4} key={connectionId}>
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
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleRemoveConnection(connectionId)}
                              sx={{ mt: 1.5 }}
                            >
                              Remove connection
                            </Button>
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

        <Grid item xs={12}>
          <Card sx={{ border: '1px solid', borderColor: 'error.light', '&:hover': { transform: 'none' } }}>
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom>
                Danger zone
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Clear your profile content or permanently delete your account and related data.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearProfile}
                >
                  Clear profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => setOpenDeleteAccount(true)}
                >
                  Delete account
                </Button>
              </Stack>
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
              onChange={(e) => {
                setExperienceForm({ ...experienceForm, title: e.target.value });
                setExperienceErrors((current) => ({ ...current, title: undefined }));
              }}
              margin="normal"
              required
              error={Boolean(experienceErrors.title)}
              helperText={experienceErrors.title}
            />
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={experienceForm.company}
              onChange={(e) => {
                setExperienceForm({ ...experienceForm, company: e.target.value });
                setExperienceErrors((current) => ({ ...current, company: undefined }));
              }}
              margin="normal"
              required
              error={Boolean(experienceErrors.company)}
              helperText={experienceErrors.company}
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
              onChange={(e) => {
                setExperienceForm({ ...experienceForm, from: e.target.value });
                setExperienceErrors((current) => ({ ...current, from: undefined }));
              }}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={Boolean(experienceErrors.from)}
              helperText={experienceErrors.from}
            />
            <TextField
              fullWidth
              label="To Date"
              name="to"
              type="date"
              value={experienceForm.to}
              onChange={(e) => {
                setExperienceForm({ ...experienceForm, to: e.target.value });
                setExperienceErrors((current) => ({ ...current, to: undefined }));
              }}
              margin="normal"
              disabled={experienceForm.current}
              InputLabelProps={{ shrink: true }}
              error={Boolean(experienceErrors.to)}
              helperText={experienceErrors.to}
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
              error={Boolean(experienceErrors.description)}
              helperText={experienceErrors.description}
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
              onChange={(e) => {
                setEducationForm({ ...educationForm, school: e.target.value });
                setEducationErrors((current) => ({ ...current, school: undefined }));
              }}
              margin="normal"
              required
              error={Boolean(educationErrors.school)}
              helperText={educationErrors.school}
            />
            <TextField
              fullWidth
              label="Degree"
              name="degree"
              value={educationForm.degree}
              onChange={(e) => {
                setEducationForm({ ...educationForm, degree: e.target.value });
                setEducationErrors((current) => ({ ...current, degree: undefined }));
              }}
              margin="normal"
              required
              error={Boolean(educationErrors.degree)}
              helperText={educationErrors.degree}
            />
            <TextField
              fullWidth
              label="Field of Study"
              name="fieldofstudy"
              value={educationForm.fieldofstudy}
              onChange={(e) => {
                setEducationForm({ ...educationForm, fieldofstudy: e.target.value });
                setEducationErrors((current) => ({ ...current, fieldofstudy: undefined }));
              }}
              margin="normal"
              required
              error={Boolean(educationErrors.fieldofstudy)}
              helperText={educationErrors.fieldofstudy}
            />
            <TextField
              fullWidth
              label="From Date"
              name="from"
              type="date"
              value={educationForm.from}
              onChange={(e) => {
                setEducationForm({ ...educationForm, from: e.target.value });
                setEducationErrors((current) => ({ ...current, from: undefined }));
              }}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={Boolean(educationErrors.from)}
              helperText={educationErrors.from}
            />
            <TextField
              fullWidth
              label="To Date"
              name="to"
              type="date"
              value={educationForm.to}
              onChange={(e) => {
                setEducationForm({ ...educationForm, to: e.target.value });
                setEducationErrors((current) => ({ ...current, to: undefined }));
              }}
              margin="normal"
              disabled={educationForm.current}
              InputLabelProps={{ shrink: true }}
              error={Boolean(educationErrors.to)}
              helperText={educationErrors.to}
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
              error={Boolean(educationErrors.description)}
              helperText={educationErrors.description}
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
              onChange={(e) => {
                setNewSkill(e.target.value);
                setSkillError('');
              }}
              margin="normal"
              required
              error={Boolean(skillError)}
              helperText={skillError}
            />
            <DialogActions>
              <Button onClick={() => setOpenSkill(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteAccount}
        onClose={() => setOpenDeleteAccount(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete account permanently?</DialogTitle>
        <DialogContent>
          <Typography>
            This deletes your profile, events, groups, connections, and login tokens. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAccount(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={handleDeleteAccount}
          >
            Delete permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
