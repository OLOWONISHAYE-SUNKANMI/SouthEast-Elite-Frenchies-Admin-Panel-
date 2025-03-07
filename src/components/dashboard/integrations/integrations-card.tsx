'use client';

import * as React from 'react';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CircularProgress, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { paths } from '@/paths';

export interface Integration {
  _id: string;
  image: string;
  category: string;
  title: string;
  date: string;
  author: string;
  content: string;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return date.toLocaleString('en-GB', options);
}

export interface IntegrationCardProps {
  integration: Integration;
  onDelete: (id: string) => void;
}

export function IntegrationCard({ integration, onDelete }: IntegrationCardProps): React.JSX.Element {
  const [hovered, setHovered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleMouseEnter = (): void => {
    setHovered(true);
  };

  const handleMouseLeave = (): void => {
    setHovered(false);
  };

  const handleTouchStart = (): void => {
    setHovered(true);
  };

  const handleTouchEnd = (): void => {
    setHovered(false);
  };

  const handleDelete = async (): Promise<void> => {
    setLoading(true);
    try {
      await axios.delete(`https://seyi-adisa-backend.onrender.com/api/posts/${integration._id}`);
      toast.success('Post deleted successfully');
      onDelete(integration._id);
    } catch (error) {
      toast.error('Error deleting post');
    } finally {
      setLoading(false);
    }
  };

  const imagePath = `https://seyi-adisa-backend.onrender.com/${integration.image.replace(/\\/g, '/')}`;

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Box
        component="img"
        sx={{
          height: 233,
          width: '100%',
        }}
        alt={integration.title}
        src={imagePath}
      />

      <CardContent sx={{ padding: '12px 14px' }}>
        <Typography sx={{ fontSize: '14px', color: 'rgb(176 147 4)', fontWeight: 500 }}>
          {integration.category}
        </Typography>
        <Typography sx={{ fontSize: '18px', color: 'grey', fontWeight: 500 }}>{integration.title}</Typography>
        <Typography sx={{ fontSize: '12px', color: 'grey' }}>{formatDate(integration.date)}</Typography>
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s, visibility 0.3s',
          visibility: hovered ? 'visible' : 'hidden',
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: 'white' }} />
        ) : (
          <>
            <Link href={paths.dashboard.viewPost(integration._id)} passHref>
              <IconButton aria-label="view" sx={{ color: 'white', marginRight: 1 }}>
                <VisibilityIcon />
              </IconButton>
            </Link>
            <IconButton aria-label="edit" sx={{ color: 'white', marginRight: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" sx={{ color: 'white' }} onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Card>
  );
}
