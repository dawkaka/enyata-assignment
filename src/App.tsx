import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home } from "./pages/Home";
import "./index.css";
import { ListAll } from "./pages/ListAll.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/list-view",
    element: <ListAll />,
  },
]);

function App() {
  return (
    <div className="w-full h-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
