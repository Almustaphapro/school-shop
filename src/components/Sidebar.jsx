import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // Role-based menu
  const menuConfig = useMemo(() => {
    const adminMenus = [
      {
        title: "Student Management",
        icon: <FiUsers />,
        key: "students",
        children: [
          { name: "Student List", path: "/admin/student-list" },
          { name: "Add New Student", path: "/admin/add-student" },
          { name: "Promote Student", path: "/admin/promote-student" },
          { name: "Student Information", path: "/admin/student-info" },
        ],
        
      },
      {
        title: "My Shop",
        icon: <FiShoppingCart />,
        key: "shop",
        children: [
          { name: "Stock Management", path: "/admin/stock" },
          { name: "My Purchase", path: "/admin/purchase" },
        ],
      },
      {
        title: "Report",
        icon: <FiBarChart2 />,
        key: "report",
        children: [
          { name: "For Sale", path: "/admin/for-sale" },
          { name: "Comprehensive Report", path: "/admin/comprehensive-report" },
        ],
      },
    ];

    if (role === "salesrep") {
      return [
        {
          title: "My Shop",
          icon: <FiShoppingCart />,
          key: "shop",
          children: [
            { name: "Search Student", path: "/sales/shop" },
          ],
        },
        {
          title: "My Shopping Report",
          icon: <FiBarChart2 />,
          key: "report",
          children: [
            { name: "My Transactions", path: "/sales/report" },
          ],
        }
      ];
    }

    return adminMenus;
  }, [role]);

  // Auto-open correct dropdown
  useEffect(() => {
    const activeMenu = menuConfig.find((menu) =>
      menu.children.some((child) =>
        location.pathname.startsWith(child.path)
      )
    );

    if (activeMenu) {
      setOpenMenu(activeMenu.key);
    }
  }, [location.pathname, menuConfig]);

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout());
    
    // Clear any additional storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login page (root path)
    navigate('/');
  };

  if (!role) return null; // Prevent crash if role not loaded

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gray-900 text-white min-h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h2 className="font-bold text-lg capitalize">
            {role.replace(/^\w/, (c) => c.toUpperCase())}
          </h2>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu size={20} />
        </button>
      </div>

      {/* Navigation Menu */}
      <ul className="px-2 space-y-2 flex-1">
        {menuConfig.map((menu) => (
          <li key={menu.key}>
            <button
              onClick={() =>
                setOpenMenu(openMenu === menu.key ? null : menu.key)
              }
              className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-3">
                {menu.icon}
                {!collapsed && <span>{menu.title}</span>}
              </div>

              {!collapsed && (
                <FiChevronDown
                  className={`transition-transform ${
                    openMenu === menu.key ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Dropdown */}
            {!collapsed && openMenu === menu.key && (
              <ul className="ml-8 mt-2 space-y-1">
                {menu.children.map((child) => (
                  <li key={child.path}>
                    <NavLink
                      to={child.path}
                      className={({ isActive }) =>
                        `block p-2 rounded text-sm ${
                          isActive
                            ? "bg-blue-600"
                            : "hover:bg-gray-700"
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {/* Super Admin Settings */}
        {role === "superadmin" && (
          <li>
            <NavLink
              to="/superadmin/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              <FiSettings />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </li>
        )}
      </ul>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-2 rounded text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
          title={collapsed ? "Logout" : ""}
        >
          <FiLogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;