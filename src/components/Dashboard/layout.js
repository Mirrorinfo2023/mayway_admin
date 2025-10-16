import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import AppLogo from '../../../public/mayway_logo.png'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Menu, MenuItem, Stack, Popover, Typography, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from "js-cookie";
import api from "../../../utils/api";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import CampaignIcon from '@mui/icons-material/Campaign';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { useSelector, useDispatch } from 'react-redux';

const drawerWidth = 200;

let menuArray = [
  { redirect: 'dashboard', name: 'Dashboard', parent: 'dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
  { redirect: '#', name: 'Masters', parent: 'masters', icon: <WidgetsIcon sx={{ fontSize: 20 }} /> },
  { redirect: '#', name: 'Affilate', parent: 'networking', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  { redirect: '#', name: 'Wallet', parent: 'wallet', icon: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} /> },
  { redirect: '#', name: 'Marketing', parent: 'marketing', icon: <CampaignIcon sx={{ fontSize: 20 }} /> },
]

let menuArray1 = [
  { redirect: 'get-banners', name: 'Banners', parent: 'masters' },
  { redirect: 'get-meeting-enroll-report', name: 'Meeting Enroll Report', parent: 'masters' },
  { redirect: 'massage-setting', name: 'Massage Setting', parent: 'masters' },
  // { redirect: 'slab-setting', name: 'marketing', parent: 'masters' },
  { redirect: 'whatsapp-setting', name: 'Whatsapp Setting', parent: 'masters' },
];

let menuArray2 = [
  { redirect: 'redeem-report', name: 'Redeem Report', parent: 'networking' },
  { redirect: 'income-report', name: 'Income Report', parent: 'networking' },
  { redirect: 'prime-user-report', name: 'Prime User Report', parent: 'networking' },
  { redirect: 'courses', name: 'Courses', parent: 'networking' },
  { redirect: 'profit-return', name: 'Profit Return', parent: 'networking' },
  { redirect: 'ip-management', name: 'Ip Management', parent: 'networking' },
]

let menuArray3 = [
  { redirect: 'user-details', name: 'User Details', parent: 'wallet' },
  { redirect: 'otp', name: 'OTP Report', parent: 'wallet' },
  { redirect: 'kyc-report', name: 'KYC Report', parent: 'wallet' },
  { redirect: 'feedback-report', name: 'Feedback Report', parent: 'wallet' },
  { redirect: 'investment', name: 'Prime Activation', parent: 'wallet' },
  { redirect: 'add-money-request', name: 'Add Money Request', parent: 'wallet' },
]

let menuArray4 = [
  { redirect: 'fcm-notification', name: 'FCM Notification', parent: 'marketing' },
  { redirect: 'rating', name: 'Rating List', parent: 'marketing' },
  { redirect: 'zoho', name: 'Zoho Meeting', parent: 'marketing' },
]

let menuArray5 = [
  { redirect: 'recharge-report', name: 'Recharge Report', parent: 'recharge' },
  { redirect: 'recharge-hold-list', name: 'Recharge Hold Report', parent: 'recharge' },
  { redirect: 'bill-payment-report', name: 'Bill Payment', parent: 'recharge' },
  { redirect: 'bill-payment-hold-list', name: 'Bill Payment Hold Report', parent: 'recharge' },
]

let menuArray6 = [
  { redirect: 'employee-role', name: 'Staff Role', parent: 'staff' },
  { redirect: 'employee-list', name: 'Staff', parent: 'staff' },
]

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const RECENT_TABS_KEY = 'recentTabs';
const RECENT_TABS_LIMIT = 5;

function getMenuNameByPath(path) {
  const cleanPath = path.replace(/^\//, '');
  const allMenus = [menuArray, ...Object.values({ menuArray1, menuArray2, menuArray3, menuArray4, menuArray5, menuArray6, })];
  for (const arr of allMenus) {
    const found = arr.find(item => item.redirect === cleanPath);
    if (found) return found.name;
  }
  return cleanPath || 'Dashboard';
}

function isWorkflowTab(path) {
  const cleanPath = path.replace(/^\//, '').split('?')[0].split('#')[0];
  const allMenus = [menuArray, ...Object.values({ menuArray1, menuArray2, menuArray3, menuArray4, menuArray5, menuArray6, })];
  for (const arr of allMenus) {
    if (arr.some(item => item.redirect === cleanPath)) return true;
  }
  return false;
}

function normalizePath(path) {
  return path.split('?')[0].split('#')[0];
}

function Layout(props) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { window: propWindow } = props;
  const { children } = props;

  const router = useRouter();
  const pathName = usePathname();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [currentMenu, setCurrentMenu] = useState('dashboard');

  // Horizontal scroll indicator state
  const [showHorizontalScroll, setShowHorizontalScroll] = useState(false);
  const mainContentRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Check for horizontal scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHorizontalScroll = () => {
      if (mainContentRef.current) {
        const container = mainContentRef.current;
        const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
        setShowHorizontalScroll(hasHorizontalScroll);

        // Update custom scrollbar
        updateCustomScrollbar();
      }
    };

    // Initial check
    checkHorizontalScroll();

    window.addEventListener('resize', checkHorizontalScroll);

    const observer = new MutationObserver(checkHorizontalScroll);
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    return () => {
      window.removeEventListener('resize', checkHorizontalScroll);
      observer.disconnect();
    };
  }, []);

  // Update custom scrollbar
  const updateCustomScrollbar = () => {
    if (mainContentRef.current && scrollThumbRef.current) {
      const container = mainContentRef.current;
      const scrollableWidth = container.scrollWidth - container.clientWidth;

      if (scrollableWidth > 0) {
        const thumbWidth = Math.max((container.clientWidth / container.scrollWidth) * 100, 10);
        const scrollLeft = container.scrollLeft;
        const thumbPosition = (scrollLeft / scrollableWidth) * (100 - thumbWidth);

        scrollThumbRef.current.style.width = `${thumbWidth}%`;
        scrollThumbRef.current.style.transform = `translateX(${thumbPosition}%)`;
        scrollThumbRef.current.style.display = 'block';
      } else {
        scrollThumbRef.current.style.display = 'none';
      }
    }
  };

  // Handle scroll for custom scrollbar
  const handleScroll = (e) => {
    updateCustomScrollbar();
  };

  // Handle mouse down on custom scrollbar
  const handleScrollbarMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    if (mainContentRef.current && scrollThumbRef.current) {
      const container = mainContentRef.current;
      const scrollbar = scrollThumbRef.current.parentElement;
      const scrollbarRect = scrollbar.getBoundingClientRect();

      const clickX = e.clientX - scrollbarRect.left;
      const scrollbarWidth = scrollbarRect.width;
      const thumbWidth = scrollThumbRef.current.offsetWidth;

      // Calculate new scroll position
      const scrollableWidth = container.scrollWidth - container.clientWidth;
      const newScrollLeft = (clickX / scrollbarWidth) * container.scrollWidth;

      container.scrollLeft = newScrollLeft;
      updateCustomScrollbar();
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (isDragging && mainContentRef.current) {
      const container = mainContentRef.current;
      const scrollbar = scrollThumbRef.current.parentElement;
      const scrollbarRect = scrollbar.getBoundingClientRect();

      const mouseX = e.clientX - scrollbarRect.left;
      const scrollbarWidth = scrollbarRect.width;

      // Calculate new scroll position
      const scrollableWidth = container.scrollWidth - container.clientWidth;
      const newScrollLeft = (mouseX / scrollbarWidth) * container.scrollWidth;

      container.scrollLeft = Math.max(0, Math.min(newScrollLeft, scrollableWidth));
      updateCustomScrollbar();
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleFirstMenuClick = (menuIndex, parent) => {
    setSelectedMenu(menuIndex);
    setCurrentMenu(parent);
    localStorage.setItem('currentMenu', parent);
  };

  useEffect(() => {
    const currentPath = pathName;
    setCurrentMenu(localStorage.getItem('currentMenu') ? localStorage.getItem('currentMenu') : 'dashboard');
    const checkPathInMenuArray = (menuArray) => {
      return menuArray.some(item => currentPath.startsWith(`/${item.redirect}`));
    };

    if (checkPathInMenuArray(menuArray1)) {
      setSelectedMenu(1);
      setCurrentMenu('masters');
    } else if (checkPathInMenuArray(menuArray2)) {
      setSelectedMenu(2);
      setCurrentMenu('networking');
    } else if (checkPathInMenuArray(menuArray3)) {
      setSelectedMenu(3);
      setCurrentMenu('wallet');
    } else if (checkPathInMenuArray(menuArray4)) {
      setSelectedMenu(4);
      setCurrentMenu('marketing');
    } else if (checkPathInMenuArray(menuArray5)) {
      setSelectedMenu(5);
      setCurrentMenu('recharge');
    } else if (checkPathInMenuArray(menuArray6)) {
      setSelectedMenu(6);
      setCurrentMenu('staff');
    } else {
      setSelectedMenu(0);
    }
  }, [pathName]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    Cookies.remove('department');
    Cookies.remove('uid');
    let role = Cookies.get('role');
    Cookies.remove('role');

    if (role === "user") {
      router.push('/login')
    }
  };

  const [loading, setLoading] = useState(false);

  const handleflushClick = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      const response = await api.get("/redis-cache-flushall");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Dropdown menu state
  const [navAnchor, setNavAnchor] = useState(null);
  const [navAnchorIdx, setNavAnchorIdx] = useState(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuCloseTimeout = useRef();

  const handleNavMenuOpen = (event, idx) => {
    clearTimeout(navMenuCloseTimeout.current);
    setNavAnchor(event.currentTarget);
    setNavAnchorIdx(idx);
    setNavMenuOpen(true);
  };

  const handleNavMenuClose = () => {
    navMenuCloseTimeout.current = setTimeout(() => {
      setNavMenuOpen(false);
      setNavAnchor(null);
      setNavAnchorIdx(null);
    }, 120);
  };

  const handleNavMenuImmediateClose = () => {
    clearTimeout(navMenuCloseTimeout.current);
    setNavMenuOpen(false);
    setNavAnchor(null);
    setNavAnchorIdx(null);
  };

  // Map parent to submenu array
  const submenuMap = {
    masters: menuArray1,
    networking: menuArray2,
    wallet: menuArray3,
    marketing: menuArray4,
    recharge: menuArray5,
    staff: menuArray6,
  };

  // New renderMenu for dropdowns
  const renderMenuDropdown = (menuArray) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {menuArray.map((item, idx) => {
        const hasSubmenu = item.parent && submenuMap[item.parent];
        const isActive = pathName.startsWith('/' + item.redirect) || currentMenu.startsWith(item.parent);
        return (
          <Box
            key={item.redirect}
            sx={{ position: 'relative', display: 'inline-block' }}
          >
            <Button
              startIcon={item.icon}
              endIcon={hasSubmenu ? <span style={{ fontSize: 12 }}>&#9662;</span> : null}
              sx={{
                color: isActive ? '#2198F3' : '#4B4B4B',
                fontWeight: isActive ? 600 : 500,
                fontSize: '15px',
                px: 2,
                py: 1,
                borderRadius: 2,
                background: isActive ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  background: '#bbdefb',
                  color: '#1976d2',
                },
                minWidth: 0,
                textTransform: 'none',
                transition: 'all 0.2s',
              }}
              aria-haspopup={hasSubmenu ? 'true' : undefined}
              aria-controls={hasSubmenu && navMenuOpen && navAnchorIdx === idx ? `nav-menu-${idx}` : undefined}
              onClick={hasSubmenu ? (e) => {
                setCurrentMenu(item.parent);
                if (navAnchorIdx === idx && navMenuOpen) {
                  handleNavMenuImmediateClose();
                } else {
                  handleNavMenuOpen(e, idx);
                }
              } : () => {
                if (item.redirect !== '#' || idx === 0) router.push(`/${item.redirect}`);
                else handleFirstMenuClick(idx, item.parent);
              }}
            >
              {item.name}
            </Button>
            {hasSubmenu && (
              <Menu
                id={`nav-menu-${idx}`}
                anchorEl={navMenuOpen && navAnchorIdx === idx ? navAnchor : null}
                open={navMenuOpen && navAnchorIdx === idx}
                onClose={handleNavMenuImmediateClose}
                MenuListProps={{
                  sx: {
                    minWidth: 200,
                    p: 0,
                    '& .MuiMenuItem-root.Mui-focusVisible': {
                      backgroundColor: 'transparent',
                    },
                    '& .MuiMenuItem-root:focus': {
                      backgroundColor: 'transparent',
                    }
                  }
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(33, 152, 243, 0.15)',
                    background: '#fff',
                    p: 0,
                  }
                }}
              >
                {submenuMap[item.parent].map((sub, subIdx) => (
                  <MenuItem
                    key={sub.redirect}
                    onClick={() => {
                      router.push(`/${sub.redirect}`);
                      handleNavMenuImmediateClose();
                    }}
                    sx={{
                      fontSize: '15px',
                      color: pathName.startsWith('/' + sub.redirect) ? '#2198F3' : '#333',
                      fontWeight: pathName.startsWith('/' + sub.redirect) ? 600 : 400,
                      background: pathName.startsWith('/' + sub.redirect) ? '#e3f2fd' : 'transparent',
                      '&:hover': {
                        background: '#bbdefb',
                        color: '#1976d2',
                      },
                      px: 2,
                      py: 1.2,
                    }}
                  >
                    {sub.name}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        );
      })}
    </Box>
  );

  // RECENT TABS STATE
  const [recentTabs, setRecentTabs] = useState([]);

  useEffect(() => {
    let tabs = JSON.parse(localStorage.getItem(RECENT_TABS_KEY) || '[]');
    tabs = tabs.filter(tab => isWorkflowTab(tab.path));
    setRecentTabs(tabs);
  }, []);

  useEffect(() => {
    if (!pathName) return;
    const normPath = normalizePath(pathName);
    if (!isWorkflowTab(normPath)) return;
    let tabs = JSON.parse(localStorage.getItem(RECENT_TABS_KEY) || '[]');
    tabs = tabs.filter(tab => normalizePath(tab.path) !== normPath);
    tabs.unshift({ path: normPath, name: getMenuNameByPath(normPath) });
    tabs = tabs.slice(0, RECENT_TABS_LIMIT);
    localStorage.setItem(RECENT_TABS_KEY, JSON.stringify(tabs));
    setRecentTabs(tabs);
  }, [pathName]);

  return (
    <Box sx={{ width: '100%', bgcolor: '#f2f5f9', minHeight: '100vh' }}>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      )}

      {/* First Row: Header */}
      <Box sx={{
        width: '100%',
        bgcolor: '#2198F3',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 3 },
        py: 1.2,
        minHeight: 56,
        position: 'sticky',
        top: 0,
        zIndex: 1200,
      }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Image 
    src={AppLogo} 
    height={28} 
    width={60} 
    alt="Logo" 
    style={{ 
      objectFit: 'contain', 
      borderRadius: 6, 
      background: '#fff', 
      padding: 1 
    }} 
  />          
  <Typography 
    variant="h6" 
    sx={{ 
      fontWeight: 700, 
      fontSize: { xs: '0.9rem', sm: '1.1rem' }, 
      letterSpacing: 0.8, 
      ml: 0.5, 
      color: '#fff' 
    }}
  >
    MAYWAY <span style={{ color: '#FFD700' }}>BUSINESS</span>
  </Typography>
</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleflushClick}
            disabled={loading}
            sx={{
              whiteSpace: 'nowrap',
              px: 2,
              py: 0.5,
              fontSize: '0.95rem',
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(33, 152, 243, 0.10)',
              background: '#2198F3',
              '&:hover': {
                background: '#1976d2',
              },
            }}
          >
            Flush cache
          </Button>
          <Button color='inherit' onClick={handleMenuClick} sx={{ minWidth: 'auto', p: 0.5, ml: 1 }}>
            <AccountCircleIcon sx={{ fontSize: 30, color: '#fff' }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, boxShadow: '0 4px 20px rgba(103,58,183,0.10)', borderRadius: 2 } }}
          >
            <MenuItem onClick={handleClose} sx={{ py: 1, px: 2 }}>Profile</MenuItem>
            <MenuItem sx={{ py: 1, px: 2 }}>
              <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/reset-password`}>
                Reset Password
              </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1, px: 2 }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Horizontal Scroll Indicator - TOP में */}
      {showHorizontalScroll && (
        <Box sx={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e0e0e0',
          position: 'sticky',
          top: 56,
          left: 0,
          zIndex: 1199,
          overflow: 'hidden'
        }}>
          <Box sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#2198F3',
            animation: 'scrollIndicator 2s infinite ease-in-out',
            '@keyframes scrollIndicator': {
              '0%': { transform: 'translateX(-100%)' },
              '50%': { transform: 'translateX(100%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }} />
        </Box>
      )}

      {/* Second Row: Navigation */}
      <Box sx={{
        width: '100%',
        bgcolor: '#fff',
        boxShadow: '0 2px 8px rgba(33, 152, 243, 0.06)',
        px: { xs: 0.5, sm: 3 },
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        minHeight: 48,
        zIndex: 1100,
        position: 'sticky',
        top: showHorizontalScroll ? 60 : 56,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#2198F3',
          borderRadius: '3px',
          '&:hover': {
            background: '#1976d2',
          },
        },
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: 'max-content',
          px: { xs: 1, sm: 0 }
        }}>
          {renderMenuDropdown(menuArray)}
        </Box>
      </Box>

      {/* Recently Opened Tabs UI */}
      {recentTabs.length > 0 && (
        <Box sx={{
          width: '100%',
          bgcolor: '#f8f9fb',
          px: { xs: 0.5, sm: 3 },
          py: { xs: 0.5, sm: 0.5 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          borderBottom: '1px solid #e3e3e3',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          minHeight: { xs: 38, sm: 44 },
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2198F3',
            borderRadius: '3px',
          },
        }}>
          <Typography sx={{ fontSize: { xs: '11px', sm: '13px' }, color: '#888', mr: 1, minWidth: 70, flexShrink: 0 }}>Recent Tabs:</Typography>
          {recentTabs.map(tab => (
            <Button
              key={tab.path}
              size="small"
              variant="outlined"
              sx={{
                fontSize: { xs: '11px', sm: '13px' },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.2, sm: 0.3 },
                borderRadius: 2,
                borderColor: '#2198F3',
                color: '#2198F3',
                background: normalizePath(pathName) === tab.path ? '#e3f2fd' : '#fff',
                fontWeight: normalizePath(pathName) === tab.path ? 600 : 400,
                minWidth: 0,
                textTransform: 'none',
                mr: 1,
                flexShrink: 0,
                '&:hover': {
                  background: '#bbdefb',
                  borderColor: '#1976d2',
                  color: '#1976d2',
                },
              }}
              onClick={() => router.push(tab.path)}
            >
              {tab.name}
            </Button>
          ))}
        </Box>
      )}

      {/* Main Content Area with WORKING TOP SCROLLBAR */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        mt: 2
      }}>
        {/* Custom Top Scrollbar - NOW CLICKABLE */}
        <Box
          sx={{
            width: '100%',
            height: '12px',
            backgroundColor: '#f1f1f1',
            borderRadius: '4px 4px 0 0',
            position: 'sticky',
            top: showHorizontalScroll ? 104 : 100,
            zIndex: 100,
            mb: 0,
            overflow: 'hidden',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e8e8e8',
            }
          }}
          onMouseDown={handleScrollbarMouseDown}
        >
          <Box
            ref={scrollThumbRef}
            sx={{
              height: '100%',
              backgroundColor: '#2198F3',
              borderRadius: '4px',
              width: '0%',
              transition: 'all 0.1s ease',
              cursor: 'grab',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              '&:active': {
                cursor: 'grabbing',
              }
            }}
          />
        </Box>

        {/* Main Content - KEEP NATIVE SCROLLBAR FOR NOW */}
        <Box
          ref={mainContentRef}
          onScroll={handleScroll}
          sx={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#f2f5f9',
            margin: 0,
            padding: 0,
            borderRadius: '0 0 5px 5px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            overflowX: 'auto',
            // Native scrollbar को visible रखें temporary के लिए
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#2198F3',
              borderRadius: '4px',
            },
          }}
        >
          <main style={{
            marginBottom: "50px",
            minWidth: 'fit-content',
            padding: '16px'
          }} className="flex-none transition-all">
            {children}
          </main>
        </Box>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;