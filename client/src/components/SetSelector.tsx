import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Card as MTGCard } from '../types/Card';
import { cardApi } from '../services/api';

interface SetSelectorProps {
  open: boolean;
  onClose: () => void;
  cardName: string;
  onSelectPrinting: (selectedCard: MTGCard) => void;
}

export const SetSelector: React.FC<SetSelectorProps> = ({
  open,
  onClose,
  cardName,
  onSelectPrinting,
}) => {
  const [printings, setPrintings] = useState<MTGCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && cardName) {
      loadPrintings();
    }
  }, [open, cardName]);

  const loadPrintings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cardApi.getCardPrintings(cardName);
      setPrintings(result);
    } catch (err) {
      setError('セット情報の読み込みに失敗しました');
      console.error('Error loading printings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrinting = (printing: MTGCard) => {
    onSelectPrinting(printing);
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        セット選択 - {cardName}
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={2}>
            {printings.map((printing) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={printing.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 }
                  }}
                  onClick={() => handleSelectPrinting(printing)}
                >
                  {printing.image_uris?.normal && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={printing.image_uris.normal}
                      alt={printing.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {printing.set_name || printing.set}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      セット: {printing.set.toUpperCase()}
                    </Typography>
                    {printing.collector_number && (
                      <Typography variant="body2" color="text.secondary">
                        コレクター番号: {printing.collector_number}
                      </Typography>
                    )}
                    {printing.released_at && (
                      <Typography variant="body2" color="text.secondary">
                        発売日: {formatDate(printing.released_at)}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      レアリティ: {printing.rarity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !error && printings.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            このカードのセット情報が見つかりませんでした。
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
};