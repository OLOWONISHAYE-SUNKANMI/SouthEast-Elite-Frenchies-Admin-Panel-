'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { CircularProgress, Grid } from '@mui/material';

import { IntegrationCard } from '@/components/dashboard/integrations/integrations-card';
import { CompaniesFilters } from '@/components/dashboard/integrations/integrations-filters';
import AddPostDialog from '@/components/dashboard/posts/AddPostDialog';
import Publication from '@/components/dashboard/publications/publication';

interface PostType {
  _id: string;
  title: string;
  category: string;
  image: string;
  author: string;
  date: string;
  content: string;
}

export default function Page(): React.ReactElement {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [integrations, setIntegrations] = React.useState<PostType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const itemsPerPage = 6;

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch('https://seyi-adisa-backend.onrender.com/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: PostType[] = await response.json();
        setIntegrations(data);
        setLoading(false);
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error) {
          const errorMessage = fetchError.message;
          toast.error(errorMessage);
          setError(errorMessage);
        }
        setLoading(false);
      }
    };

    fetchData().catch((err: unknown) => {
      if (err instanceof Error) {
        // console.error('Error in fetchData:', err.message);
      }
    });
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page when a new search is performed
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    setCategory(event.target.value as string);
    setPage(1); // Reset to the first page when a new category is selected
  };

  // Filter integrations based on search term and category
  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === '' || integration.category === category)
  );

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredIntegrations.slice(startIndex, endIndex);

  const pageCount = Math.ceil(filteredIntegrations.length / itemsPerPage);

  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handlePostAdded = (newPost: PostType): void => {
    // Add the new post to the current list of integrations
    setIntegrations((prevIntegrations) => [newPost, ...prevIntegrations]);
  };

  const handlePostDeleted = (deletedPostId: string): void => {
    // Update the list of integrations to remove the deleted post
    setIntegrations((prevIntegrations) => prevIntegrations.filter((integration) => integration._id !== deletedPostId));
  };

  return (
    <Stack spacing={3}>
      <ToastContainer />
      <Stack direction="row" justifyContent="space-between" spacing={3}>
        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" color="rgb(176 147 4)" />}>
          Export
        </Button>
        <Button
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: '#000041',
            '&:hover': {
              backgroundColor: '#000080',
            },
          }}
          startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" color="rgb(176 147 4)" />}
          variant="contained"
        >
          Add
        </Button>
      </Stack>
      <AddPostDialog open={openDialog} onClose={handleCloseDialog} onPostAdded={handlePostAdded} />
      <CompaniesFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={(event) => {
          handleCategoryChange(event as React.ChangeEvent<{ value: string }>);
        }}
      />
      {loading ? (
        <Box
          sx={{
            margin: '0 auto',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Box
          sx={{
            m: 2,
            textAlign: 'center',
          }}
        >
          Error: {error}
        </Box>
      ) : filteredIntegrations.length === 0 ? (
        <Box
          sx={{
            m: 2,
            textAlign: 'center',
          }}
        >
          No results found.
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentItems.map((integration) => (
              <Grid item key={integration._id} lg={4} md={6} xs={12}>
                <IntegrationCard integration={integration} onDelete={handlePostDeleted} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination count={pageCount} page={page} onChange={handlePageChange} size="small" />
          </Box>
        </>
      )}
      <Publication />
    </Stack>
  );
}
