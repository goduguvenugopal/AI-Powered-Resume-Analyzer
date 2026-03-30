import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./routes/AppRouter";
import { toastConfig } from "./config/toast.config";

function App() {
  return (
    <>
      <RouterProvider router={AppRouter} />
      <ToastContainer {...toastConfig} />
    </>
  );
}

export default App;
