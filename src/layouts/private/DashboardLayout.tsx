import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemButton,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import {
  Dashboard,
  Store,
  People,
  ShoppingCart,
  Reviews,
  Receipt,
  ShoppingBag,
  FavoriteBorder,
  LocalShipping,
  Category,
  Image,
  Inventory,
  ExpandLess,
  ExpandMore,
  School,
  Article,
  Settings,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, type JSX } from "react";
import { useAuth } from "../../context/AuthContext";

interface MenuItemType {
  text: string;
  path: string;
  icon: JSX.Element;
  children?: MenuItemType[];
}

const menuItems: MenuItemType[] = [
  {
    text: "Dashboard",
    path: "/dashboard/overview",
    icon: <Dashboard />,
  },
  {
    text: "E-Commerce",
    path: "/dashboard/ecommerce",
    icon: <Store />,
    children: [
      { text: "Products", path: "/dashboard/products", icon: <Inventory /> },
      { text: "Categories", path: "/dashboard/categories-management", icon: <Category /> },
      { text: "Product Variants", path: "/dashboard/product-variants", icon: <Settings /> },
      { text: "Product Images", path: "/dashboard/product-images", icon: <Image /> },
      { text: "Orders", path: "/dashboard/orders", icon: <ShoppingCart /> },
      { text: "Customers", path: "/dashboard/customers", icon: <People /> },
      { text: "Carts", path: "/dashboard/carts", icon: <ShoppingBag /> },
      { text: "Wishlists", path: "/dashboard/wishlists", icon: <FavoriteBorder /> },
      { text: "Reviews", path: "/dashboard/reviews", icon: <Reviews /> },
    ],
  },
  {
    text: "Finance",
    path: "/dashboard/finance",
    icon: <Receipt />,
    children: [
      { text: "Invoices", path: "/dashboard/invoices", icon: <Receipt /> },
      { text: "Discounts", path: "/dashboard/discounts", icon: <LocalShipping /> },
    ],
  },
  {
    text: "Logistics",
    path: "/dashboard/logistics",
    icon: <LocalShipping />,
    children: [
      { text: "Shipping Methods", path: "/dashboard/shipping-methods", icon: <LocalShipping /> },
    ],
  },
  {
    text: "Content",
    path: "/dashboard/content",
    icon: <Article />,
    children: [
      { text: "Posts", path: "/dashboard/posts", icon: <Article /> },
      { text: "Courses", path: "/dashboard/courses", icon: <School /> },
      { text: "Categories (Legacy)", path: "/dashboard/categories", icon: <Category /> },
    ],
  },
  {
    text: "Users",
    path: "/dashboard/users-management",
    icon: <People />,
  },
];

export default function DashboardLayout(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleUserClick = (e: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    localStorage.clear();
    navigate("/");
  };

  const handleMenuToggle = (menuText: string): void => {
    setOpenMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText]
    }));
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItemType, depth = 0): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.text];

    if (hasChildren) {
      return (
        <Box key={item.text}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMenuToggle(item.text)}
              sx={{ pl: 2 + depth * 2 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem disablePadding key={item.text}>
        <ListItemButton
          onClick={() => navigate(item.path)}
          selected={isActive(item.path)}
          sx={{
            pl: 2 + depth * 2,
            backgroundColor: isActive(item.path) ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
            '&:hover': {
              backgroundColor: isActive(item.path) ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        sx={{ 
          width: 280, 
          [`& .MuiDrawer-paper`]: { 
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0'
          } 
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Admin Panel
          </Typography>
        </Toolbar>
        <List sx={{ paddingTop: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Drawer>
      <Box flexGrow={1}>
        <AppBar position="static" sx={{ bgcolor: "#1976d2", zIndex: 1000 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/022/791/223/small/blog-site-blogger-png.png"
                alt="logo"
                width="32"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
              BlogApp Admin
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={handleUserClick}
              sx={{ cursor: "pointer" }}
            >
              <Avatar src="/user.png" />
              <Typography>{user?.name || "Usuario"}</Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Salir</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box p={3} sx={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
