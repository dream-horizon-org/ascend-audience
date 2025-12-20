import { useState } from 'react';
import { Box, Typography, Divider, Alert } from '@mui/material';
import AscendButton from '../../components/AscendButton/AscendButton';
import AscendTextField from '../../components/AscendTextField/AscendTextField';
import AscendSearchbar from '../../components/AscendSearchbar/AscendSearchbar';
import AscendDropdown from '../../components/AscendDropdown/AscendDropdown';
import AscendAutoComplete from '../../components/AscendAutoComplete/AscendAutoComplete';
import AscendModal from '../../components/AscendModal/AscendModal';
import AscendSnackbar from '../../components/AscendSnackbar/AscendSnackbar';
import AscendPaper from '../../components/AscendPaper/AscendPaper';
import AscendMenu from '../../components/AscendMenu/AscendMenu';
import AscendMenuItem from '../../components/AscendMenuItem/AscendMenuItem';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';

export default function ComponentsShowcase() {
  // State for interactive components
  const [textFieldValue, setTextFieldValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const [multiDropdownValue, setMultiDropdownValue] = useState<string[]>([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState({
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const dropdownOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const autoCompleteOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarConfig({ message, severity });
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>
        Ascend Components Showcase
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        A comprehensive demonstration of all available Ascend components and their variants
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* AscendButton Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendButton
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Customizable button component with various styles and states
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <AscendButton variant="contained" color="primary">
              Primary Button
            </AscendButton>
            <AscendButton variant="contained" color="secondary">
              Secondary Button
            </AscendButton>
            <AscendButton variant="outlined" color="primary">
              Outlined Button
            </AscendButton>
            <AscendButton variant="text" color="primary">
              Text Button
            </AscendButton>
            <AscendButton 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => showSnackbar('Button with start icon clicked!', 'success')}
            >
              With Icon
            </AscendButton>
            <AscendButton 
              variant="contained" 
              endIcon={<DeleteIcon />}
              color="error"
            >
              Delete
            </AscendButton>
            <AscendButton variant="contained" disabled>
              Disabled
            </AscendButton>
          </Box>
          
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sizes: small, medium, large | Variants: contained, outlined, text
          </Typography>
        </AscendPaper>
      </Box>

      {/* AscendTextField Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendTextField
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Input field with label, info tooltip, and validation support
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <AscendTextField
              label="Basic Input"
              placeholder="Enter text..."
              value={textFieldValue}
              onChange={(e) => setTextFieldValue(e.target.value)}
            />
            <AscendTextField
              label="Required Field"
              placeholder="This field is required"
              required
            />
            <AscendTextField
              label="With Info Tooltip"
              placeholder="Hover the info icon"
              infoText="This is helpful information about this field"
            />
            <AscendTextField
              label="Error State"
              placeholder="Invalid input"
              error
              helperText="This field has an error"
            />
            <AscendTextField
              label="Disabled Field"
              placeholder="Cannot edit"
              disabled
              value="Disabled value"
            />
            <AscendTextField
              label="Multiline Text"
              placeholder="Enter multiple lines..."
              multiline
              rows={4}
            />
          </Box>
        </AscendPaper>
      </Box>

      {/* AscendSearchbar Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendSearchbar
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Search input with customizable icon and placeholder
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AscendSearchbar
              placeholder="Search with default icon..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <AscendSearchbar
              placeholder="Search without icon..."
              showIcon={false}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AscendSearchbar
                placeholder="Small size..."
                size="small"
                fullWidth={false}
                sx={{ width: '300px' }}
              />
              <AscendSearchbar
                placeholder="Medium size..."
                size="medium"
                fullWidth={false}
                sx={{ width: '300px' }}
              />
            </Box>
          </Box>
          {searchValue && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Current search value: <strong>{searchValue}</strong>
            </Alert>
          )}
        </AscendPaper>
      </Box>

      {/* AscendDropdown Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendDropdown
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Dropdown with single, multi-checkbox, and multi-chip variants
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <div>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Single Select</Typography>
              <AscendDropdown
                variant="single"
                placeholder="Select an option..."
                options={dropdownOptions}
                value={dropdownValue}
                onChange={(val) => setDropdownValue(val as string)}
                fullWidth
              />
            </div>
            
            <div>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Multi-Checkbox</Typography>
              <AscendDropdown
                variant="multi-checkbox"
                placeholder="Select multiple..."
                options={dropdownOptions}
                value={multiDropdownValue}
                onChange={(val) => setMultiDropdownValue(val as string[])}
                fullWidth
              />
            </div>
            
            <div>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Multi-Chip</Typography>
              <AscendDropdown
                variant="multi-chip"
                placeholder="Select with chips..."
                options={dropdownOptions}
                value={multiDropdownValue}
                onChange={(val) => setMultiDropdownValue(val as string[])}
                fullWidth
              />
            </div>

            <div>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>With Count Label</Typography>
              <AscendDropdown
                variant="multi-checkbox"
                label="Options"
                placeholder="Select multiple..."
                options={dropdownOptions}
                value={multiDropdownValue}
                onChange={(val) => setMultiDropdownValue(val as string[])}
                showCount
                fullWidth
              />
            </div>

            <div>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Different Sizes</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AscendDropdown
                  variant="single"
                  size="sm"
                  placeholder="Small..."
                  options={dropdownOptions}
                  fullWidth
                />
                <AscendDropdown
                  variant="single"
                  size="lg"
                  placeholder="Large..."
                  options={dropdownOptions}
                  fullWidth
                />
              </Box>
            </div>
          </Box>
          
          {(dropdownValue || multiDropdownValue.length > 0) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Selected: <strong>{dropdownValue || multiDropdownValue.join(', ')}</strong>
            </Alert>
          )}
        </AscendPaper>
      </Box>

      {/* AscendAutoComplete Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendAutoComplete
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Autocomplete input with search and filtering capabilities
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <AscendAutoComplete
              label="Basic Autocomplete"
              options={autoCompleteOptions}
              value={autoCompleteValue}
              onChange={(_, newValue) => setAutoCompleteValue(newValue as string | null)}
              placeholder="Type to search..."
            />
            
            <AscendAutoComplete
              label="Required Autocomplete"
              options={autoCompleteOptions}
              required
              placeholder="Type to search..."
              infoText="Start typing to see matching options"
            />
            
            <AscendAutoComplete
              label="With Error"
              options={autoCompleteOptions}
              error
              helperText="Please select a valid option"
              placeholder="Type to search..."
            />
          </Box>
          
          {autoCompleteValue && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Selected: <strong>{autoCompleteValue}</strong>
            </Alert>
          )}
        </AscendPaper>
      </Box>

      {/* AscendModal Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendModal
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Customizable modal dialog with flexible content and actions
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <AscendButton 
              variant="contained"
              onClick={() => setModalOpen(true)}
            >
              Open Modal
            </AscendButton>
          </Box>

          <AscendModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            config={{
              title: 'Example Modal',
              description: 'This is an example modal demonstrating the AscendModal component.',
              content: (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    You can add any content here. This modal is fully customizable with various options:
                  </Typography>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>Custom width and height</li>
                    <li>Close on backdrop click or escape key</li>
                    <li>Custom actions and buttons</li>
                    <li>Nested modals support</li>
                  </ul>
                </Box>
              ),
              width: 500,
              closeButtonText: 'Got it!',
              actions: (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <AscendButton 
                    variant="outlined"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </AscendButton>
                  <AscendButton 
                    variant="contained"
                    onClick={() => {
                      setModalOpen(false);
                      showSnackbar('Modal action confirmed!', 'success');
                    }}
                  >
                    Confirm
                  </AscendButton>
                </Box>
              ),
              showCloseButton: false,
            }}
          />
        </AscendPaper>
      </Box>

      {/* AscendSnackbar Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendSnackbar
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Toast notifications with different severity levels
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <AscendButton 
              variant="contained"
              color="success"
              onClick={() => showSnackbar('Success! Operation completed successfully.', 'success')}
            >
              Show Success
            </AscendButton>
            <AscendButton 
              variant="contained"
              color="error"
              onClick={() => showSnackbar('Error! Something went wrong.', 'error')}
            >
              Show Error
            </AscendButton>
            <AscendButton 
              variant="contained"
              color="warning"
              onClick={() => showSnackbar('Warning! Please review your input.', 'warning')}
            >
              Show Warning
            </AscendButton>
            <AscendButton 
              variant="contained"
              color="info"
              onClick={() => showSnackbar('Info: Here is some useful information.', 'info')}
            >
              Show Info
            </AscendButton>
          </Box>

          <AscendSnackbar
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarConfig.message}
            severity={snackbarConfig.severity}
            autoHideDuration={3000}
          />
        </AscendPaper>
      </Box>

      {/* AscendPaper Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendPaper
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Container component with elevation and shadow effects
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
          <AscendPaper elevation={0} sx={{ p: 3 }}>
            <Typography variant="body2">Elevation 0</Typography>
          </AscendPaper>
          <AscendPaper elevation={1} sx={{ p: 3 }}>
            <Typography variant="body2">Elevation 1</Typography>
          </AscendPaper>
          <AscendPaper elevation={2} sx={{ p: 3 }}>
            <Typography variant="body2">Elevation 2</Typography>
          </AscendPaper>
          <AscendPaper elevation={3} sx={{ p: 3 }}>
            <Typography variant="body2">Elevation 3</Typography>
          </AscendPaper>
          <AscendPaper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="body2">Outlined Variant</Typography>
          </AscendPaper>
        </Box>
      </Box>

      {/* AscendMenu Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          AscendMenu & AscendMenuItem
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Context menu with custom menu items
        </Typography>
        
        <AscendPaper sx={{ p: 3 }}>
          <IconButton 
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <MoreVertIcon />
          </IconButton>
          
          <AscendMenu
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={() => setMenuAnchor(null)}
          >
            <AscendMenuItem onClick={() => {
              setMenuAnchor(null);
              showSnackbar('Edit action triggered', 'info');
            }}>
              Edit
            </AscendMenuItem>
            <AscendMenuItem onClick={() => {
              setMenuAnchor(null);
              showSnackbar('Copy action triggered', 'info');
            }}>
              Copy
            </AscendMenuItem>
            <AscendMenuItem onClick={() => {
              setMenuAnchor(null);
              showSnackbar('Delete action triggered', 'warning');
            }}>
              Delete
            </AscendMenuItem>
          </AscendMenu>
          
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            Click the menu icon to see the menu items
          </Typography>
        </AscendPaper>
      </Box>

      {/* Footer */}
      <Divider sx={{ mt: 6, mb: 3 }} />
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
        All components are built on top of Material-UI and can be customized with MUI theming
      </Typography>
    </Box>
  );
}

