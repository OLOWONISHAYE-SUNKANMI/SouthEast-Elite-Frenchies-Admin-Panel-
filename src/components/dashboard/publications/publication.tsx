import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import AddPublicationDialog from './AddPublication';

const Root = styled(Box)(({}) => ({
  margin: '0 auto',
}));

const CustomCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  borderRadius: '15px',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const Media = styled(CardMedia)(({ theme }) => ({
  height: '100%',
  width: 300,
  [theme.breakpoints.down('md')]: {
    height: 200,
    width: '100%',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '1rem',
  width: '100%',

  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface Publication {
  _id: string;
  name: string;
  description: string;
  image: string;
  pdfFile: string;
}

export default function Publication(): React.JSX.Element {
  const [downloading, setDownloading] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const postsPerPage = 4;

  const [openDialog, setOpenDialog] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [selectedPublication, setSelectedPublication] = React.useState<Publication | null>(null);

  React.useEffect(() => {
    const fetchPublications = async (): Promise<void> => {
      try {
        const response = await axios.get<Publication[]>('https://seyi-adisa-backend.onrender.com/api/publications');
        setPublications(response.data);
      } catch (error) {
        toast.error('Failed to fetch publications');
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const totalPages = Math.ceil(publications.length / postsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  const displayedPublications = publications.slice((page - 1) * postsPerPage, page * postsPerPage);

  const handleOpenDialog = (): void => {
    setEditing(false);
    setSelectedPublication(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handleAddPublication = (newPublication: Publication): void => {
    setPublications((prevPublications) => [newPublication, ...prevPublications]);
  };

  const handleUpdatePublication = (updatedPublication: Publication): void => {
    setPublications((prevPublications) =>
      prevPublications.map((publication) =>
        publication._id === updatedPublication._id ? updatedPublication : publication
      )
    );
  };

  const handleDelete = async (id: string): Promise<void> => {
    setDeleting(id);
    try {
      await axios.delete(`https://seyi-adisa-backend.onrender.com/api/publications/${id}`);
      setPublications((prevPublications) => prevPublications.filter((publication) => publication._id !== id));
      toast.success('Publication deleted successfully!');
    } catch (error) {
      toast.error('Deletion failed. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (publication: Publication): void => {
    setEditing(true);
    setSelectedPublication(publication);
    setOpenDialog(true);
  };

  const handleDownload = async (id: string): Promise<void> => {
    setDownloading(true);
    try {
      const response = await axios.get(`https://seyi-adisa-backend.onrender.com/api/publications/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'publication.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download successful!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Stack direction="row" justifyContent="space-between" spacing={3}>
        <Typography fontSize="25px" fontWeight="500">
          Publications
        </Typography>
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

      <Root>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {publications.length === 0 ? (
              <Typography variant="h6" component="div" textAlign="center" marginTop="2rem">
                No publications
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {displayedPublications.map((publication) => (
                  <Grid item xs={12} sm={6} key={publication._id}>
                    <CustomCard>
                      <Media
                        image={`https://seyi-adisa-backend.onrender.com/${publication.image.replace(/\\/g, '/')}`}
                        title={publication.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {publication.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {publication.description}
                        </Typography>
                        <IconContainer>
                          <IconButton
                            onClick={() => handleDelete(publication._id)}
                            disabled={deleting === publication._id}
                          >
                            {deleting === publication._id ? <CircularProgress size={24} /> : <DeleteIcon />}
                          </IconButton>
                          <IconButton onClick={() => handleEdit(publication)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDownload(publication._id)} disabled={downloading}>
                            {downloading ? <CircularProgress size={24} /> : <DownloadIcon />}
                          </IconButton>
                        </IconContainer>
                      </CardContent>
                    </CustomCard>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination count={totalPages} page={page} onChange={handleChangePage} />
            </Box>
          </>
        )}
        <AddPublicationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onAdd={handleAddPublication}
          onUpdate={handleUpdatePublication}
          editing={editing}
          publication={selectedPublication}
        />
      </Root>
    </>
  );
}
