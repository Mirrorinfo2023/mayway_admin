import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Settings,
  PlusCircle,
  List,
  UserCog,
  HelpCircle,
  BarChart3,
  MessageCircle,
  FileBarChart,
  AreaChart,
  LineChart,
  PieChart,
  ShoppingBag,
  Megaphone,
  PanelTop,
  LogOut,
  FileText,
  Banknote,
} from "lucide-react";

const ICON_SIZE = {
  main: 20,
  sub: 18,
};

// Main navigation items
const mainNavItems = [
  {
    title: "Dashboard",
    path: "/dashboard/new",
    icon: <LayoutDashboard size={ICON_SIZE.main} />,
  },
];

// Mirror App section
const plusCartItems = {
  title: "Mirror App",
  icon: <ShoppingBag size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "UI Manager",
      path: "/pluscart/ui-manager",
      icon: <PanelTop size={ICON_SIZE.sub} />,
    },
    {
      title: "Overview",
      path: "/pluscart/overview",
      icon: <PanelTop size={ICON_SIZE.sub} />,
    },
    {
      title: "Promotions",
      path: "/pluscart/promotions",
      icon: <Megaphone size={ICON_SIZE.sub} />,
    },
  ],
};

// Product management section
const productItems = {
  title: "products",
  icon: <Package size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "In House Product",
      path: "/products/inhouse-product",
      icon: <PlusCircle size={ICON_SIZE.sub} />,
    },
    {
      title: "All Products",
      path: "products",
      icon: <List size={ICON_SIZE.sub} />,
    },
    {
      title: "Add Product",
      path: "/products/add-product",
      icon: <PlusCircle size={ICON_SIZE.sub} />,
    },
    {
      title: "Category",
      path: "/category",
      icon: <PlusCircle size={ICON_SIZE.sub} />,
      submenu: [
        {
          title: "Categories List",
          path: "/category-list",
          icon: <List size={ICON_SIZE.sub} />,
        },
        // {
        //   title: "Sub Categories List",
        //   path: "/category/sub-categories",
        //   icon: <List size={ICON_SIZE.sub} />,
        // },
        {
          title: "Add Category",
          path: "/category",
          icon: <PlusCircle size={ICON_SIZE.sub} />,
        },
      ],
    },
    {
      title: "Cancel Products",
      path: "/product/cancel",
      icon: <List size={ICON_SIZE.sub} />,
    },
  ],
};

// Reports
const reportItems = {
  title: "Reports",
  icon: <FileBarChart size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "Sales Report",
      path: "/sales",
      icon: <AreaChart size={ICON_SIZE.sub} />,
    },
    {
      title: "Product Report",
      path: "/product-analytics",
      icon: <BarChart3 size={ICON_SIZE.sub} />,
    },
    {
      title: "Customer Report",
      path: "/customers-report",
      icon: <PieChart size={ICON_SIZE.sub} />,
    },
    {
      title: "Inventory Report",
      path: "/inventory-report",
      icon: <LineChart size={ICON_SIZE.sub} />,
    },
  ],
};

// Vendor section with updated icons
const vendorItems = {
  title: "Vendors",
  icon: <UserCog size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "All Vendors",
      path: "/vendor",
      icon: <Users size={ICON_SIZE.sub} />,
    },
    {
      title: "Vendor Analytics",
      path: "/vendor-analytics",
      icon: <LineChart size={ICON_SIZE.sub} />,
    },
    {
      title: "Vendor KYC",
      path: "/vendors-kyc",
      icon: <FileText size={ICON_SIZE.sub} />,
    },
    {
      title: "Vendor Withdrawal",
      path: "/vendors-withdrawal",
      icon: <Banknote size={ICON_SIZE.sub} />,
    },
  ],
};

const promotionItems = {
  title: "Promotion Management",
  icon: <FileBarChart size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "Banner Setup",
      path: "/permotions/banner-setup",
      icon: <AreaChart size={ICON_SIZE.sub} />,
    },
    {
      title: "Offers & Deals",
      path: "/promotions/offers-deals",
      icon: <BarChart3 size={ICON_SIZE.sub} />,
      submenu: [
        {
          title: "Coupon",
          path: "/permotions/coupons",
          icon: <BarChart3 size={ICON_SIZE.sub} />,
        },
        {
          title: "Fetured Deals",
          path: "/permotions/fetured-deals",
          icon: <BarChart3 size={ICON_SIZE.sub} />,
        },
      ],
    },
    {
      title: "Notification",
      path: "/permotions/notification",
      icon: <PieChart size={ICON_SIZE.sub} />,
    },
    {
      title: "Announcement",
      path: "/permotions/annoucement",
      icon: <LineChart size={ICON_SIZE.sub} />,
    },
  ],
};

// User management
const userItems = {
  title: "User Management",
  icon: <Users size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "All Users",
      path: "/users",
      icon: <UserCog size={ICON_SIZE.sub} />,
    },
    {
      title: "User Analytics",
      path: "/users-analytics",
      icon: <BarChart3 size={ICON_SIZE.sub} />,
    },
     {
      title: "User Reviews",
      path: "/customer-review",
      icon: <BarChart3 size={ICON_SIZE.sub} />,
    },
  ],
};

// Order management
const orderItems = {
  title: "Orders",
  icon: <ShoppingCart size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "All Orders",
      path: "/orders",
      icon: <List size={ICON_SIZE.sub} />,
    },
    {
      title: "Order Analytics",
      path: "/orders-analytics",
      icon: <BarChart3 size={ICON_SIZE.sub} />,
    },
  ],
};

// Support
const supportItems = {
  title: "Customer Support",
  icon: <MessageSquare size={ICON_SIZE.main} />,
  submenu: [
    {
      title: "Support Dashboard",
      path: "/customer-support",
      icon: <HelpCircle size={ICON_SIZE.sub} />,
    },
    {
      title: "Live Chat",
      path: "/live-chat",
      icon: <MessageCircle size={ICON_SIZE.sub} />,
    },
  ],
};

// Utility section
const utilityItems = [
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings size={ICON_SIZE.main} />,
  },
  {
    title: "Logout",
    path: "/logout",
    icon: <LogOut size={ICON_SIZE.main} />,
  },
];

// Export sidebar data
export const sidebarData = [
  ...mainNavItems,
  plusCartItems,
  vendorItems,
  productItems,
  reportItems,
  userItems,
  orderItems,
  promotionItems,
  supportItems,
  ...utilityItems,
];

export const sidebarStyle = ``;
