import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const FileInput = styled('input')({
  display: 'none',
});

interface Publication {
  _id: string;
  name: string;
  description: string;
  image: string;
  pdfFile: string;
}

interface AddPublicationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newPublication: Publication) => void;
  onUpdate: (updatedPublication: Publication) => void;
  editing: boolean;
  publication: Publication | null;
}

const AddPublicationDialog: React.FC<AddPublicationDialogProps> = ({
  open,
  onClose,
  onAdd,
  onUpdate,
  editing,
  publication,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing && publication) {
      setName(publication.name);
      setDescription(publication.description);
      setImagePreview(`https://seyi-adisa-backend.onrender.com/${publication.image.replace(/\\/g, '/')}`);
      setPdfPreview(`https://seyi-adisa-backend.onrender.com/${publication.pdfFile.replace(/\\/g, '/')}`);
    } else {
      setName('');
      setDescription('');
      setImage(null);
      setPdfFile(null);
      setImagePreview(null);
      setPdfPreview(null);
    }
  }, [editing, publication]);

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setPdfFile(file);
    setPdfPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAddOrUpdatePublication = async (): Promise<void> => {
    if (!name || !description || (!pdfFile && !editing) || (!image && !editing)) {
      toast.error('Please fill in all fields and upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (pdfFile) formData.append('pdfFile', pdfFile);
    if (image) formData.append('image', image);

    setLoading(true);

    try {
      let response;
      if (editing && publication) {
        response = await axios.put(
          `https://seyi-adisa-backend.onrender.com/api/publications/${publication._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        toast.success('Publication updated successfully!');
        onUpdate(response.data);
      } else {
        response = await axios.post('https://seyi-adisa-backend.onrender.com/api/publications', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Publication added successfully!');
        onAdd(response.data);
      }
      // Clear inputs after successful add/update
      setName('');
      setDescription('');
      setPdfFile(null);
      setImage(null);
      setPdfPreview(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${editing ? 'update' : 'add'} publication.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
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

      <DialogTitle>{editing ? 'Edit Publication' : 'Add Publication'}</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            fullWidth
            multiline
            rows={4}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <label htmlFor="pdf-upload">
              <FileInput accept="application/pdf" id="pdf-upload" type="file" onChange={handlePdfChange} />
              <Button
                variant="contained"
                component="span"
                sx={{
                  backgroundColor: '#000041',
                  '&:hover': {
                    backgroundColor: '#000080',
                  },
                }}
              >
                Upload PDF
              </Button>
            </label>
            {pdfPreview ? (
              <Typography variant="body2" color="textSecondary">
                {pdfFile ? 'PDF selected' : 'Existing PDF'}
              </Typography>
            ) : null}
          </Box>
          <Box
            display="flex"
            gap={2}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'unset', sm: 'center' },
            }}
          >
            <label htmlFor="image-upload">
              <FileInput accept="image/*" id="image-upload" type="file" onChange={handleImageChange} />
              <Button
                sx={{
                  backgroundColor: '#000041',
                  '&:hover': {
                    backgroundColor: '#000080',
                  },
                }}
                variant="contained"
                component="span"
              >
                Upload Image
              </Button>
            </label>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
              />
            ) : null}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAddOrUpdatePublication}
          color="primary"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: '#000041',
            '&:hover': {
              backgroundColor: '#000080',
            },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'grey' }} /> : editing ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPublicationDialog;
