import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuConfig = [
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

  // Auto-open dropdown when route matches
  useEffect(() => {
    menuConfig.forEach((menu) => {
      menu.children.forEach((child) => {
        if (location.pathname === child.path) {
          setOpenMenu(menu.key);
        }
      });
    });
  }, [location.pathname]);

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gray-900 text-white min-h-screen transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h2 className="font-bold text-lg">
            {role === "superadmin" ? "Super Admin" : "Admin"}
          </h2>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu size={20} />
        </button>
      </div>

      <ul className="px-2 space-y-2">

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
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openMenu === menu.key && !collapsed
                  ? "max-h-96"
                  : "max-h-0"
              }`}
            >
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
            </div>
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
    </div>
  );
};

export default Sidebar;