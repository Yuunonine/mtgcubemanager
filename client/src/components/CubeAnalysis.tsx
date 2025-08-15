import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { cubeApi } from '../services/api';
import { CubeCard, CubeAnalysis as CubeAnalysisType } from '../types/Card';

interface Props {
  cubeId?: string;
  cards: CubeCard[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const COLOR_MAPPING = {
  white: '#FFFBD5',
  blue: '#0E68AB',
  black: '#150B00',
  red: '#D3202A',
  green: '#00733E',
  multicolor: '#F8D020',
  colorless: '#CCC2C0'
};

const CubeAnalysis: React.FC<Props> = ({ cubeId, cards }) => {
  const [analysis, setAnalysis] = useState<CubeAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cubeId && cards.length > 0) {
      loadAnalysis();
    } else {
      setAnalysis(null);
      setLoading(false);
    }
  }, [cubeId, cards]);

  const loadAnalysis = async () => {
    if (!cubeId) return;

    try {
      const data = await cubeApi.analyzeCube(cubeId);
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to load cube analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading analysis...</Typography>;
  }

  if (!analysis) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="text.secondary">
          No analysis available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add cards to your cube to see analysis
        </Typography>
      </Box>
    );
  }

  const colorData = Object.entries(analysis.colorDistribution).map(([color, count]) => ({
    name: color.charAt(0).toUpperCase() + color.slice(1),
    value: count,
    fill: COLOR_MAPPING[color as keyof typeof COLOR_MAPPING] || '#999'
  }));

  const manaCurveData = Object.entries(analysis.manaCurve)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([cmc, count]) => ({
      cmc: cmc === '10' ? '10+' : cmc,
      count
    }));

  const typeData = Object.entries(analysis.typeDistribution).map(([type, count]) => ({
    name: type,
    value: count
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cube Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {analysis.totalCards}
            </Typography>
            <Typography variant="subtitle1">
              Total Cards
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {analysis.averageCmc}
            </Typography>
            <Typography variant="subtitle1">
              Average CMC
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {Object.keys(analysis.colorDistribution).length}
            </Typography>
            <Typography variant="subtitle1">
              Color Categories
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {Object.keys(analysis.typeDistribution).length}
            </Typography>
            <Typography variant="subtitle1">
              Card Types
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Color Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={colorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {colorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mana Curve
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={manaCurveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cmc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Color Breakdown
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(analysis.colorDistribution).map(([color, count]) => (
                <Chip
                  key={color}
                  label={`${color.charAt(0).toUpperCase() + color.slice(1)}: ${count}`}
                  variant="outlined"
                  sx={{
                    bgcolor: COLOR_MAPPING[color as keyof typeof COLOR_MAPPING],
                    color: ['white', 'multicolor', 'colorless'].includes(color) ? '#000' : '#fff'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rarity Distribution
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rarity</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analysis.rarityDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .map(([rarity, count]) => (
                    <TableRow key={rarity}>
                      <TableCell component="th" scope="row">
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </TableCell>
                      <TableCell align="right">{count}</TableCell>
                      <TableCell align="right">
                        {((count / analysis.totalCards) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Type Distribution
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analysis.typeDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, count]) => (
                    <TableRow key={type}>
                      <TableCell component="th" scope="row">
                        {type}
                      </TableCell>
                      <TableCell align="right">{count}</TableCell>
                      <TableCell align="right">
                        {((count / analysis.totalCards) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CubeAnalysis;