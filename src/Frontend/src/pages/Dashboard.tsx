import React from 'react';
import { Typography, Box, Stack, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Sample data for charts
const storageData = [
  { name: 'Electronics', value: 35 },
  { name: 'Furniture', value: 25 },
  { name: 'Stationery', value: 20 },
  { name: 'Other', value: 20 },
];

const activityData = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 3 },
  { name: 'Wed', count: 7 },
  { name: 'Thu', count: 2 },
  { name: 'Fri', count: 5 },
  { name: 'Sat', count: 1 },
  { name: 'Sun', count: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddNewItem = () => {
    navigate('/storage');
  };

  const recentActivity = [
    { action: 'Added', item: 'Laptop', user: 'John', time: '10 min ago' },
    { action: 'Updated', item: 'Desk Chair', user: 'Sarah', time: '2 hours ago' },
    { action: 'Removed', item: 'Printer', user: 'Mike', time: '1 day ago' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 340,
            flex: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Storage Overview
          </Typography>
          <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 340,
            flex: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Box sx={{ height: 150, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {recentActivity.map((activity, index) => (
              <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>{activity.action}</strong> {activity.item} by {activity.user}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 340,
            flex: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNewItem}
              fullWidth
            >
              Add New Item
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/storage')}
              fullWidth
            >
              View Inventory
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/settings')}
              fullWidth
            >
              Update Settings
            </Button>
          </Box>
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Storage Statistics
            </Typography>
            <Typography variant="body2">
              <strong>Total Items:</strong> 143
            </Typography>
            <Typography variant="body2">
              <strong>Categories:</strong> 4
            </Typography>
            <Typography variant="body2">
              <strong>Locations:</strong> 5
            </Typography>
            <Typography variant="body2">
              <strong>Last Update:</strong> Today at 10:45 AM
            </Typography>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Dashboard; 