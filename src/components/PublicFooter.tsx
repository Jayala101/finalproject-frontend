import { 
  Box, 
  Typography, 
  Container, 
  Divider,
  Stack,
  IconButton,
  Link
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { JSX } from "react";

export default function PublicFooter(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            {/* Logo and Description */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 300 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                BlogApp
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                Plataforma dedicada a conectar escritores y lectores apasionados. 
                Comparte tus ideas, descubre nuevas perspectivas y forma parte de nuestra comunidad.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Enlaces Rápidos
              </Typography>
              <Stack spacing={1}>
                <Link href="/" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                  Inicio
                </Link>
                <Link href="/posts" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                  Artículos
                </Link>
                <Link href="/login" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                  Iniciar Sesión
                </Link>
                <Link href="/register" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                  Registrarse
                </Link>
              </Stack>
            </Box>

            {/* Contact Info */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contacto
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ fontSize: 16, opacity: 0.8 }}>
                    <EmailIcon />
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    info@blogapp.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ fontSize: 16, opacity: 0.8 }}>
                    <PhoneIcon />
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ fontSize: 16, opacity: 0.8 }}>
                    <LocationOnIcon />
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Ciudad, País
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Social Media */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Síguenos
              </Typography>
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(29, 161, 242, 0.2)',
                      color: '#1da1f2'
                    } 
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(66, 103, 178, 0.2)',
                      color: '#4267B2'
                    } 
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(225, 48, 108, 0.2)',
                      color: '#E1306C'
                    } 
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(10, 102, 194, 0.2)',
                      color: '#0A66C2'
                    } 
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#ffffff'
                    } 
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 BlogApp. Todos los derechos reservados. | 
            <Link href="/privacy" color="inherit" underline="hover" sx={{ ml: 1, mr: 1 }}>
              Política de Privacidad
            </Link>
            |
            <Link href="/terms" color="inherit" underline="hover" sx={{ ml: 1 }}>
              Términos de Uso
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}