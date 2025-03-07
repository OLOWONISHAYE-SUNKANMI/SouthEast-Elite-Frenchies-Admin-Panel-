// ./src/components/dashboard/posts/AddPostDialog.tsx

import * as React from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { CircularProgress } from '@mui/material';

interface Post {
  _id: string; // Ensure _id is present for consistency with your backend data structure
  image: string;
  category: string;
  title: string;
  description: string;
  date: string;
  author: string;
  content: string;
}

interface AddPostDialogProps {
  open: boolean;
  onClose: () => void;
  onPostAdded: (post: Post) => void; // Ensure onPostAdded accepts Post type
}

export default function AddPostDialog({ open, onClose, onPostAdded }: AddPostDialogProps): React.ReactElement {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [content, setContent] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  const categories = ['Technology', 'Health', 'Travel', 'Food', 'Education', 'Fitness', 'Fashion', 'Business'];

  const handleSubmit = async (): Promise<void> => {
    if (!title || !category || !content || !selectedImage || !description) {
      toast.warning('Please fill out all fields and select an image.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', new Date().toISOString());
    formData.append('author', 'Seyi Adisa');
    formData.append('content', content);

    try {
      const response = await axios.post('https://seyi-adisa-backend.onrender.com/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post added successfully!');

      // Ensure the response data is in the format of Post
      onPostAdded(response.data as Post);

      setTitle('');
      setCategory('');
      setContent('');
      setDescription('');
      setImagePreview(null);
      setSelectedImage(null);

      onClose();
    } catch (error) {
      toast.error('There was an error adding the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  const handleImageIconClick = (): void => {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement | null;
    fileInput?.click();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Post</DialogTitle>
      <DialogContent>
        {imagePreview ? <img src={imagePreview} alt="Preview" style={{ width: '100%', marginBottom: 10, borderRadius: '8px' }} /> : null}
        <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        <Button
          onClick={handleImageIconClick}
          variant="contained"
          color="primary"
          startIcon={<AddPhotoAlternateIcon sx={{ color: 'rgb(176 147 4)' }} />}
          style={{ marginBottom: 10 }}
          sx={{
            backgroundColor: '#000041',
            '&:hover': {
              backgroundColor: '#000080',
            },
          }}
        >
          Select Image
        </Button>
        <TextField label="Title" value={title} onChange={(e) => { setTitle(e.target.value); }} fullWidth margin="normal" />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); }}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => { setCategory(e.target.value); }}
          fullWidth
          margin="normal"
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Content"
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          multiline
          fullWidth
          rows={6}
          margin="normal"
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: '#000041',
            '&:hover': {
              backgroundColor: '#000080',
            },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'grey' }} /> : 'Add Post'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
