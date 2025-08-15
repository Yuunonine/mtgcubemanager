import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import CubeList from './components/CubeList';
import CubeView from './components/CubeView';
import Manual from './components/Manual';
import { LanguageProvider } from './contexts/LanguageContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
              MTG Cube Manager
            </Typography>
            <Box display="flex" gap={1}>
              <Button 
                color="inherit" 
                startIcon={<HelpIcon />}
                component={Link}
                to="/manual"
              >
                マニュアル
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<CubeList />} />
            <Route path="/cube/:cubeId" element={<CubeView />} />
            <Route path="/manual" element={<Manual />} />
          </Routes>
        </Container>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;