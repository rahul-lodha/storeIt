import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  region: string;
  storage: string;
}

const Dashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setIsAdmin(role === 'admin');

    if (role === 'admin') {
      axios.get('http://localhost:8080/admin/dashboard')
        .then((response) => {
          console.log('API Response:', response.data);
          // Transform the data to match the expected structure
          const transformedData = response.data.regions.map((region: any, index: number) => ({
            id: index + 1,
            name: `User ${index + 1}`, // Placeholder name
            region: region,
            storage: response.data.storageUsage[index]?.provider || 'Unknown',
          }));
          setUserData(transformedData);
        })
        .catch((error) => {
          console.error('Error fetching dashboard data:', error);
          setUserData([]);
        });
    }
  }, []);

  console.log('User Data:', userData); // Log userData state

  if (!isAdmin) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1">
          You do not have permission to view this page.
        </Typography>
      </Box>
    );
  }

  if (userData.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
        <Typography variant="body1">
          Please wait while we fetch the data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        User Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Storage Provider</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell>{user.storage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;