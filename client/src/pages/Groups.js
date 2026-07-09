import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Avatar,
    Chip,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Group as GroupIcon,
    People as PeopleIcon,
    Groups as GroupsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tags: ''
    });
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const currentUserId = String(user?.id || user?._id || '');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await axios.get('/api/groups');
            setGroups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors((current) => ({ ...current, [e.target.name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const nextFieldErrors = {};
        const name = formData.name.trim();
        const description = formData.description.trim();
        const tags = formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        if (!name) {
            nextFieldErrors.name = 'Group name is required';
        } else if (name.length < 2 || name.length > 100) {
            nextFieldErrors.name = 'Group name must be 2 to 100 characters';
        }

        if (!description) {
            nextFieldErrors.description = 'Description is required';
        } else if (description.length < 10 || description.length > 2000) {
            nextFieldErrors.description = 'Description must be 10 to 2000 characters';
        }

        if (tags.length === 0) {
            nextFieldErrors.tags = 'Add at least one tag';
        }

        if (Object.keys(nextFieldErrors).length > 0) {
            setFieldErrors(nextFieldErrors);
            return;
        }

        setFieldErrors({});
        try {
            const payload = {
                name,
                description,
                tags
            };

            const res = await axios.post('/api/groups', payload);
            setGroups([...groups, res.data]);
            setOpen(false);
            setFormData({ name: '', description: '', tags: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Unable to create group');
        }
    };

    const handleLeaveGroup = async (groupId) => {
        if (!window.confirm('Leave this group?')) return;

        try {
            await axios.delete(`/api/groups/${groupId}/leave`);
            await fetchGroups();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Unable to leave group');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <GroupsIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1">
                            Groups
                        </Typography>
                        <Typography color="text.secondary">
                            Join communities and connect around shared interests
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Create Group
                </Button>
            </Box>

            <Grid container spacing={3}>
                {groups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                        <GroupIcon />
                                    </Avatar>
                                    <Typography variant="h6" component="div">
                                        {group.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {group.description}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {group.tags && group.tags.map((tag, index) => (
                                        <Chip key={index} label={tag} size="small" color="primary" variant="outlined" />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, color: 'text.secondary' }}>
                                    <PeopleIcon fontSize="small" />
                                    <Typography variant="caption">
                                        {group.members?.length || 0} members
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ px: 2, pb: 2 }}>
                                {group.members?.some((member) => String(member._id || member) === currentUserId) && (
                                    <Button size="small" color="error" onClick={() => handleLeaveGroup(group._id)}>
                                        Leave Group
                                    </Button>
                                )}
                                <Button size="small" variant="contained" onClick={() => navigate(`/groups/${group._id}`)}>
                                    View Group
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {groups.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    <GroupsIcon sx={{ fontSize: 56, opacity: 0.4, mb: 1 }} />
                    <Typography>No groups found. Create one to get started!</Typography>
                </Box>
            )}

            {/* Create Group Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    {error && (
                        <Box sx={{ mb: 2, color: 'error.main' }}>{error}</Box>
                    )}
                    <form onSubmit={handleSubmit} id="create-group-form">
                        <TextField
                            autoFocus
                            margin="normal"
                            name="name"
                            label="Group Name"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={handleChange}
                            error={Boolean(fieldErrors.name)}
                            helperText={fieldErrors.name}
                        />
                        <TextField
                            margin="normal"
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            required
                            value={formData.description}
                            onChange={handleChange}
                            error={Boolean(fieldErrors.description)}
                            helperText={fieldErrors.description}
                        />
                        <TextField
                            margin="normal"
                            name="tags"
                            label="Tags (comma separated)"
                            fullWidth
                            value={formData.tags}
                            onChange={handleChange}
                            error={Boolean(fieldErrors.tags)}
                            helperText={fieldErrors.tags || 'e.g. technology, alumni, batch-2023'}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" form="create-group-form" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Groups;
