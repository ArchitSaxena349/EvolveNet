import React, { useState, useEffect, useContext } from 'react';
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
    Chip
} from '@mui/material';
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tags: ''
    });
    // const { user } = useContext(AuthContext); // Unused
    const navigate = useNavigate();

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Tags might be comma separated string in backend, let's check model briefly if needed.
            // Usually backend expects array or string. passing tags as string to let backend handle or split validly if needed.
            // Based on Event model, tags was array. Let's assume tags here is similar.
            // Checking groupController/model if possible would be best but let's try standard split.
            const payload = {
                title: formData.name, // Assuming 'title' or 'name'. Group model usually has name. Let's start with name.
                name: formData.name,
                description: formData.description,
                tags: formData.tags.split(',').map(tag => tag.trim())
            };

            const res = await axios.post('/api/groups', payload);
            setGroups([...groups, res.data]);
            setOpen(false);
            setFormData({ name: '', description: '', tags: '' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Groups
                </Typography>
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
                                <Box sx={{ mt: 1 }}>
                                    {group.tags && group.tags.map((tag, index) => (
                                        <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Box>
                                <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                                    {group.members?.length || 0} members
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => navigate(`/groups/${group._id}`)}>
                                    View Group
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {groups.length === 0 && (
                <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
                    No groups found. Create one to get started!
                </Typography>
            )}

            {/* Create Group Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
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
                        />
                        <TextField
                            margin="normal"
                            name="tags"
                            label="Tags (comma separated)"
                            fullWidth
                            value={formData.tags}
                            onChange={handleChange}
                            helperText="e.g. technology, alumni, batch-2023"
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
