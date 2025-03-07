import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

interface CompaniesFiltersProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  onCategoryChange: (event: SelectChangeEvent) => void; // Update the type here
}

export function CompaniesFilters({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
}: CompaniesFiltersProps): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.2rem',
      }}
    >
      <OutlinedInput
        value={searchTerm}
        onChange={onSearchChange}
        fullWidth
        placeholder="Search posts"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{
          maxWidth: isMobile ? '100%' : '500px',
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000080',
          },
        }}
      />

      <Select
        value={category}
        onChange={onCategoryChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Select category' }}
        sx={{
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '10px' : 0,
        }}
      >
        <MenuItem value="">All Categories</MenuItem>
        <MenuItem value="Technology">Technology</MenuItem>
        <MenuItem value="Health">Health</MenuItem>
        <MenuItem value="Travel">Travel</MenuItem>
        <MenuItem value="Food">Food</MenuItem>
        <MenuItem value="Education">Education</MenuItem>
        <MenuItem value="Fitness">Fitness</MenuItem>
        <MenuItem value="Fashion">Fashion</MenuItem>
        <MenuItem value="Business">Business</MenuItem>
      </Select>
    </Card>
  );
}
