import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Avatar,
    Box,
    Tabs,
    Tab,
    Chip,
    TextField
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Connections = () => {
    const [tabValue, setTabValue] = useState(0);
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchConnections();
        fetchRequests();
        if (tabValue === 2) {
            fetchAllUsers();
        }
        // eslint-disable-next-line
    }, [tabValue]);

    const fetchConnections = async () => {
        try {
            const res = await axios.get('/api/connections');
            setConnections(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/connections/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            // Filter out self
            setAllUsers(res.data.filter(u => u._id !== user._id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await axios.post(`/api/connections/${userId}`);
            alert('Connection request sent!');
            fetchAllUsers(); // Refresh list to update status if we track it locally
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error sending request');
        }
    };

    const handleAccept = async (id) => {
        try {
            await axios.put(`/api/connections/${id}/accept`);
            fetchRequests();
            fetchConnections();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`/api/connections/${id}/reject`);
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async (id) => {
        if (window.confirm('Are you sure you want to remove this connection?')) {
            try {
                await axios.delete(`/api/connections/${id}`);
                fetchConnections();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    // ... (keep usage of useEffects, API calls same)

    // Filtered users for "Find Alumni"
    const filteredUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Network
            </Typography>

            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label={`My Connections (${connections.length})`} />
                <Tab label={`Requests (${requests.length})`} />
                <Tab label="Find Alumni" />
            </Tabs>

            {/* MY CONNECTIONS TAB */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {connections.map((conn) => {
                        const otherUser = conn.user._id === user._id ? conn.connectedUser : conn.user;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={conn._id}>
                                <Card>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={otherUser.profile?.picture} sx={{ mr: 2 }}>{otherUser.name[0]}</Avatar>
                                        <Box>
                                            <Typography variant="h6">{otherUser.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{otherUser.email}</Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="error" onClick={() => handleRemove(conn._id)}>
                                            Remove
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                    {connections.length === 0 && <Typography sx={{ mt: 2, ml: 2 }}>No connections yet.</Typography>}
                </Grid>
            )}

            {/* REQUESTS TAB */}
            {tabValue === 1 && (
                <Grid container spacing={3}>
                    {requests.map((req) => (
                        <Grid item xs={12} sm={6} md={4} key={req._id}>
                            <Card>
                                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={req.user.profile?.picture} sx={{ mr: 2 }}>{req.user.name[0]}</Avatar>
                                    <Box>
                                        <Typography variant="h6">{req.user.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Wants to connect
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" variant="contained" onClick={() => handleAccept(req._id)}>
                                        Accept
                                    </Button>
                                    <Button size="small" onClick={() => handleReject(req._id)}>
                                        Reject
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                    {requests.length === 0 && <Typography sx={{ mt: 2, ml: 2 }}>No pending requests.</Typography>}
                </Grid>
            )}

            {/* FIND ALUMNI TAB */}
            {tabValue === 2 && (
                <Box>
                    <TextField
                        fullWidth
                        placeholder="Search alumni by name, email, or role..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <Grid container spacing={3}>
                        {filteredUsers.map((u) => (
                            <Grid item xs={12} sm={6} md={4} key={u._id}>
                                <Card>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={u.profile?.picture} sx={{ mr: 2 }}>{u.name[0]}</Avatar>
                                        <Box>
                                            <Typography variant="h6">{u.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                            {u.role && <Chip label={u.role} size="small" sx={{ mt: 0.5 }} />}
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" variant="outlined" onClick={() => handleConnect(u._id)}>
                                            Connect
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {filteredUsers.length === 0 && (
                            <Typography sx={{ mt: 2, ml: 2, width: '100%', textAlign: 'center' }}>
                                No alumni found matching "{searchTerm}"
                            </Typography>
                        )}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default Connections;
