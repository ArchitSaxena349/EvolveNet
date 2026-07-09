import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Avatar,
    Box,
    Chip,
    Divider,
    Paper,
    Stack,
    CircularProgress,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    People as PeopleIcon,
    Groups as GroupsIcon,
    DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const GroupDetail = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroup();
        // eslint-disable-next-line
    }, [id]);

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`/api/groups/${id}`);
            setGroup(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const currentUserId = String(user?.id || user?._id || '');
    const isMember = group?.members?.some(member => String(member._id || member) === currentUserId);
    const isCreator = String(group?.creator?._id || group?.creator) === currentUserId;

    const handleJoin = async () => {
        try {
            if (isMember) {
                await axios.delete(`/api/groups/${id}/leave`);
            } else {
                await axios.post(`/api/groups/${id}/join`);
            }
            fetchGroup();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm('Delete this group permanently?')) return;

        try {
            await axios.delete(`/api/groups/${id}`);
            navigate('/groups');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!group) {
        return (
            <Container sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Group not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/groups')} sx={{ mt: 1 }}>
                    Back to Groups
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/groups')} sx={{ mb: 2 }}>
                Back to Groups
            </Button>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 4, overflow: 'hidden', '&:hover': { transform: 'none' } }}>
                        {/* Gradient banner */}
                        <Box
                            sx={{
                                p: { xs: 3, md: 4 },
                                color: 'common.white',
                                backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 55%, #06b6d4 130%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                <GroupsIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                                    {group.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, opacity: 0.9 }}>
                                    <PeopleIcon fontSize="small" />
                                    <Typography variant="body2">{group.members?.length || 0} members</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {group.tags?.map((tag, index) => (
                                    <Chip key={index} label={tag} color="primary" variant="outlined" size="small" />
                                ))}
                            </Box>
                            <Typography variant="body1" paragraph>
                                {group.description}
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                                <Button
                                    variant={isMember ? "outlined" : "contained"}
                                    color={isMember ? "error" : "primary"}
                                    size="large"
                                    onClick={handleJoin}
                                >
                                    {isMember ? 'Leave Group' : 'Join Group'}
                                </Button>
                                {isCreator && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="large"
                                        startIcon={<DeleteForeverIcon />}
                                        onClick={handleDeleteGroup}
                                    >
                                        Delete Group
                                    </Button>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Members ({group.members?.length || 0})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            {group.members?.map((member) => (
                                <Box key={member._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar src={member.profile?.picture} sx={{ bgcolor: 'primary.main' }}>
                                        {(member.name || 'U').trim().charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="subtitle2" noWrap>{member.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {member.profile?.title || 'Member'}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                            {group.members?.length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    No members yet.
                                </Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GroupDetail;
