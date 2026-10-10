import AdminLayout from "app/views/admin";
import HomeLayout from "app/views/home";
import OriginalHouse from "app/views/home/originhome/OriginalHouse";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        Component: OriginalHouse,
      },
    ],
  },

  {
    path: "/admin",
    Component: AdminLayout,
    children: [
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}