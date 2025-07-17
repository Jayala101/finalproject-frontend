import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Link
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import type { ProductContent, ProductDocument } from '../../types';

interface RichContentDisplayProps {
  content: ProductContent[];
}

const RichContentDisplay: React.FC<RichContentDisplayProps> = ({ content }) => {
  if (!content || content.length === 0) {
    return null;
  }

  const primaryContent = content[0]; // Use the first content entry

  const renderSpecifications = (specifications: Record<string, any>) => {
    const entries = Object.entries(specifications);
    if (entries.length === 0) return null;

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Specification</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Value</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderFeatures = (features: string[]) => {
    if (!features || features.length === 0) return null;

    return (
      <List dense>
        {features.map((feature, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircleIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body2" color="text.primary">
                  {feature}
                </Typography>
              } 
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderTags = (tags: any[]) => {
    if (!tags || tags.length === 0) return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={typeof tag === 'object' ? tag.name || tag.value : String(tag)}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  };

  const renderDocuments = (documents: ProductDocument[]) => {
    if (!documents || documents.length === 0) return null;

    const getDocumentIcon = (type: string) => {
      switch (type) {
        case 'manual':
        case 'specification':
          return <DescriptionIcon fontSize="small" />;
        case 'warranty':
          return <PdfIcon fontSize="small" />;
        default:
          return <DescriptionIcon fontSize="small" />;
      }
    };

    return (
      <List dense>
        {documents.map((doc) => (
          <ListItem key={doc.id} disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {getDocumentIcon(doc.type)}
            </ListItemIcon>
            <ListItemText>
              <Link
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="primary"
              >
                <Typography variant="body2">
                  {doc.name}
                  {doc.size && (
                    <Typography 
                      component="span" 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({(doc.size / 1024 / 1024).toFixed(1)} MB)
                    </Typography>
                  )}
                </Typography>
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    );
  };

  const renderVideoUrls = (videoUrls: string[]) => {
    if (!videoUrls || videoUrls.length === 0) return null;

    return (
      <List dense>
        {videoUrls.map((url, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <VideoIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="primary"
              >
                <Typography variant="body2">
                  Video {index + 1}
                </Typography>
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Rich Description */}
      {primaryContent.richDescription && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Product Details
          </Typography>
          <Box
            dangerouslySetInnerHTML={{ __html: primaryContent.richDescription }}
            sx={{
              '& p': { mb: 2 },
              '& ul, & ol': { pl: 2, mb: 2 },
              '& h1, & h2, & h3, & h4, & h5, & h6': { mb: 1, mt: 2 },
            }}
          />
        </Box>
      )}

      {/* Additional Description */}
      {primaryContent.description && !primaryContent.richDescription && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Description
          </Typography>
          <Typography variant="body1" color="text.primary" paragraph>
            {primaryContent.description}
          </Typography>
        </Box>
      )}

      {/* Collapsible Sections */}
      <Box sx={{ mt: 2 }}>
        {/* Features */}
        {primaryContent.features && primaryContent.features.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="primary">
                Key Features
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderFeatures(primaryContent.features)}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Specifications */}
        {primaryContent.specifications && Object.keys(primaryContent.specifications).length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="primary">
                Technical Specifications
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderSpecifications(primaryContent.specifications)}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Documents */}
        {primaryContent.documents && primaryContent.documents.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="primary">
                Documentation
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderDocuments(primaryContent.documents)}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Videos */}
        {primaryContent.videoUrls && primaryContent.videoUrls.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="primary">
                Product Videos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderVideoUrls(primaryContent.videoUrls)}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Tags */}
      {primaryContent.tags && primaryContent.tags.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Product Tags
          </Typography>
          {renderTags(primaryContent.tags)}
        </Box>
      )}
    </Box>
  );
};

export default RichContentDisplay;
