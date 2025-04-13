import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface StorageItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

const initialItems: StorageItem[] = [
  { id: 1, name: 'Laptop', category: 'Electronics', quantity: 5, location: 'Room A' },
  { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 10, location: 'Warehouse B' },
  { id: 3, name: 'Notebooks', category: 'Stationery', quantity: 100, location: 'Storage C' },
  { id: 4, name: 'Monitors', category: 'Electronics', quantity: 15, location: 'Room A' },
  { id: 5, name: 'Filing Cabinet', category: 'Furniture', quantity: 8, location: 'Office D' },
];

const categories = ['Electronics', 'Furniture', 'Stationery', 'Other'];

const Storage: React.FC = () => {
  const [items, setItems] = useState<StorageItem[]>(initialItems);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<StorageItem>({
    id: 0,
    name: '',
    category: '',
    quantity: 0,
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setCurrentItem({
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
      name: '',
      category: '',
      quantity: 0,
      location: '',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (item: StorageItem) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSave = () => {
    if (isEditing) {
      setItems(items.map(item => (item.id === currentItem.id ? currentItem : item)));
    } else {
      setItems([...items, currentItem]);
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Storage Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={handleOpen}
        >
          Add Item
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No items found. Add your first storage item!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={currentItem.name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            select
            margin="dense"
            name="category"
            label="Category"
            fullWidth
            variant="outlined"
            value={currentItem.category}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={currentItem.quantity}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            variant="outlined"
            value={currentItem.location}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Storage; 