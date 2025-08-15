import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { cubeApi } from '../services/api';

interface Cube {
  id: string;
  name: string;
  description?: string;
  cardCount: number;
}

const CubeList: React.FC = () => {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [open, setOpen] = useState(false);
  const [newCubeName, setNewCubeName] = useState('');
  const [newCubeDescription, setNewCubeDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCubes();
  }, []);

  const loadCubes = async () => {
    try {
      const data = await cubeApi.getAllCubes();
      setCubes(data);
    } catch (error) {
      console.error('Failed to load cubes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCube = async () => {
    if (!newCubeName.trim()) return;

    try {
      await cubeApi.createCube(newCubeName.trim());
      setOpen(false);
      setNewCubeName('');
      setNewCubeDescription('');
      loadCubes();
    } catch (error) {
      console.error('Failed to create cube:', error);
    }
  };

  const handleCubeClick = (cubeId: string) => {
    navigate(`/cube/${cubeId}`);
  };

  if (loading) {
    return <Typography>Loading cubes...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Cubes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          New Cube
        </Button>
      </Box>

      <Grid container spacing={3}>
        {cubes.map((cube) => (
          <Grid item xs={12} sm={6} md={4} key={cube.id}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => handleCubeClick(cube.id)}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {cube.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {cube.description || 'No description'}
                </Typography>
                <Box mt={2}>
                  <Chip 
                    label={`${cube.cardCount} cards`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {cubes.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No cubes found
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Create your first cube to get started
          </Typography>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Cube</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cube Name"
            fullWidth
            variant="outlined"
            value={newCubeName}
            onChange={(e) => setNewCubeName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newCubeDescription}
            onChange={(e) => setNewCubeDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCube} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CubeList;