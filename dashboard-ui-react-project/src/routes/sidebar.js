/** @format */

import {
  FiCompass,
  FiGrid,
  FiSlack,
  FiUsers
} from "react-icons/fi";

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Bảng Điều Khiển", // name that appear in Sidebar
  },

  {
    icon: FiSlack,
    name: "Danh Mục",
    routes: [
      {
        path: "/products",
        name: "Sản Phẩm",
      },
      {
        path: "/categories",
        name: "Thể Loại",
      },
      {
        path: "/attributes",
        name: "Thuộc Tính",
      },
    ],
  },

  {
    path: "/customers",
    icon: FiUsers,
    name: "Khách Hàng",
  },
  {
    path: "/orders",
    icon: FiCompass,
    name: "Đơn Hàng",
  },

   
];

export default sidebar;
