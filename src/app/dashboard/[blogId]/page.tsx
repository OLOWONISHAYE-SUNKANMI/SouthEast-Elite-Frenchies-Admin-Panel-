'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

export interface Blog {
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

const ViewBlog: React.FC = (): React.ReactElement => {
  const params = useParams();
  const blogId = params.blogId as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlog = async (): Promise<void> => {
      try {
        const response = await axios.get<Blog>(`https://seyi-adisa-backend.onrender.com/api/posts/${blogId}`);
        setBlog(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // console.error('Error fetching blog:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog().catch((error: unknown) => {
        /* console.error('Error in fetching blog:', error); */
      });
    }
  }, [blogId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={20} sx={{ m: 2 }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Blog not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" padding={3}>
      <Card sx={{ maxWidth: 800, width: '100%' }}>
        <Box
          component="img"
          sx={{
            height: 400,
            width: '100%',
            objectFit: 'cover',
          }}
          alt={blog.title}
          src={`https://seyi-adisa-backend.onrender.com/${blog.image}`}
        />
        <CardContent>
          <Typography
            variant="overline"
            display="block"
            gutterBottom
            sx={{ fontSize: '14px', color: 'rgb(176 147 4)', fontWeight: 500 }}
          >
            {blog.category}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {blog.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {formatDate(blog.date)} | By {blog.author}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            {blog.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewBlog;
