import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Newsletter from "./pages/Newsletter"
import Waitlist from "./pages/Waitlist"
import News from "./pages/News"
import Admin from "./pages/Admin"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "news", Component: News },
      { path: "newsletter", Component: Newsletter },
      { path: "waitlist", Component: Waitlist },
      { path: "admin", Component: Admin },
      { path: "*", Component: Home },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
