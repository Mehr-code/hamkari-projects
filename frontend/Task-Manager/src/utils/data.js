// Importing icons from react-icons library
import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu";

// Sidebar menu data for admin panel
export const SIDE_MENU_DATA = [
  {
    id: "01", // Unique identifier for the menu item
    label: "پیشخوان", // Display name in the sidebar
    icon: LuLayoutDashboard, // Icon component
    path: "/admin/dashboard", // Navigation path
  },
  {
    id: "02",
    label: "مدیریت وظایف",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "ایجاد وظیفه",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "04",
    label: "اعضای تیم",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "خروج",
    icon: LuLogOut,
    path: "logout",
  },
];

// Sidebar menu data for user panel
export const SIDE__MENU_USER_DATA = [
  {
    id: "01",
    label: "پیشخوان",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "وظایف من",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "05",
    label: "خروج",
    icon: LuLogOut,
    path: "logout",
  },
];

// Priority options for tasks
export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

// Status options for tasks
export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];
