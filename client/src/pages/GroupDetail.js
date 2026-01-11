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
    Paper
} from '@mui/material';
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

    const isMember = group?.members?.some(member => member._id === user?._id);

    const handleJoin = async () => {
        try {
            if (isMember) {
                await axios.delete(`/api/groups/${id}/join`);
            } else {
                await axios.post(`/api/groups/${id}/join`);
            }
            fetchGroup();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!group) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>Group not found</Typography>
                <Button onClick={() => navigate('/groups')} sx={{ mt: 2 }}>
                    Back to Groups
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button onClick={() => navigate('/groups')} sx={{ mb: 2 }}>
                &larr; Back to Groups
            </Button>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h3" component="h1" gutterBottom>
                                {group.name}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {group.tags?.map((tag, index) => (
                                    <Chip key={index} label={tag} sx={{ mr: 1 }} />
                                ))}
                            </Box>
                            <Typography variant="body1" paragraph>
                                {group.description}
                            </Typography>

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant={isMember ? "outlined" : "contained"}
                                    color={isMember ? "error" : "primary"}
                                    onClick={handleJoin}
                                >
                                    {isMember ? 'Leave Group' : 'Join Group'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Members ({group.members?.length || 0})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box>
                            {group.members?.map((member) => (
                                <Box key={member._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar src={member.profile?.picture} sx={{ mr: 2 }}>
                                        {member.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">{member.name}</Typography>
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
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GroupDetail;
