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
    TextField,
    Stack,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    People as PeopleIcon,
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    Hub as HubIcon,
    DeleteOutline as DeleteOutlineIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EmptyState = ({ icon, text }) => (
    <Box sx={{ textAlign: 'center', py: 6, width: '100%', color: 'text.secondary' }}>
        <Box sx={{ opacity: 0.4, mb: 1, '& svg': { fontSize: 48 } }}>{icon}</Box>
        <Typography color="text.secondary">{text}</Typography>
    </Box>
);

const Connections = () => {
    const [tabValue, setTabValue] = useState(0);
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
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
                setSnack({ open: true, message: 'Connection removed', severity: 'success' });
            } catch (err) {
                console.error(err);
                setSnack({
                    open: true,
                    message: err.response?.data?.error || 'Error removing connection',
                    severity: 'error'
                });
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    // ... (keep usage of useEffects, API calls same)

    // Filtered users for "Find Alumni"
    const filteredUsers = allUsers.filter(u => {
        const term = searchTerm.toLowerCase();
        return (
            (u.name && u.name.toLowerCase().includes(term)) ||
            (u.email && u.email.toLowerCase().includes(term)) ||
            (u.role && u.role.toLowerCase().includes(term))
        );
    });

    const initialOf = (name) => (name || 'U').trim().charAt(0).toUpperCase();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Page header */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <HubIcon />
                </Avatar>
                <Box>
                    <Typography variant="h4" component="h1">
                        Network
                    </Typography>
                    <Typography color="text.secondary">
                        Manage your connections and discover new people
                    </Typography>
                </Box>
            </Stack>

            <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label={`My Connections (${connections.length})`} />
                <Tab label={`Requests (${requests.length})`} />
                <Tab label="Find Alumni" />
            </Tabs>

            {/* MY CONNECTIONS TAB */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {connections.map((conn) => {
                        const otherUser = conn.user?._id === user._id ? conn.connectedUser : conn.user;
                        if (!otherUser) return null;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={conn._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                                        <Avatar src={otherUser.profile?.picture} sx={{ bgcolor: 'primary.main', width: 52, height: 52 }}>
                                            {initialOf(otherUser.name)}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="h6" noWrap>{otherUser.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>{otherUser.email}</Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2 }}>
                                        <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => handleRemove(conn._id)}>
                                            Remove
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                    {connections.length === 0 && <EmptyState icon={<PeopleIcon />} text="No connections yet. Find alumni to get started." />}
                </Grid>
            )}

            {/* REQUESTS TAB */}
            {tabValue === 1 && (
                <Grid container spacing={3}>
                    {requests.map((req) => (
                        <Grid item xs={12} sm={6} md={4} key={req._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                                    <Avatar src={req.user.profile?.picture} sx={{ bgcolor: 'secondary.main', width: 52, height: 52 }}>
                                        {initialOf(req.user.name)}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="h6" noWrap>{req.user.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Wants to connect
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ px: 2, pb: 2 }}>
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
                    {requests.length === 0 && <EmptyState icon={<PersonAddIcon />} text="No pending requests." />}
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container spacing={3}>
                        {filteredUsers.map((u) => (
                            <Grid item xs={12} sm={6} md={4} key={u._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                                        <Avatar src={u.profile?.picture} sx={{ bgcolor: 'primary.main', width: 52, height: 52 }}>
                                            {initialOf(u.name)}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="h6" noWrap>{u.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>{u.email}</Typography>
                                            {u.role && <Chip label={u.role} size="small" color="secondary" variant="outlined" sx={{ mt: 0.5 }} />}
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2 }}>
                                        <Button size="small" variant="contained" startIcon={<PersonAddIcon />} onClick={() => handleConnect(u._id)}>
                                            Connect
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {filteredUsers.length === 0 && (
                            <EmptyState icon={<SearchIcon />} text={searchTerm ? `No alumni found matching "${searchTerm}"` : 'No alumni to show.'} />
                        )}
                    </Grid>
                </Box>
            )}

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((current) => ({ ...current, open: false }))}
            >
                <Alert
                    onClose={() => setSnack((current) => ({ ...current, open: false }))}
                    severity={snack.severity}
                    sx={{ width: '100%' }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Connections;
