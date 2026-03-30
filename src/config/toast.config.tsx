import type { ToastContainerProps } from "react-toastify";

export const toastConfig: ToastContainerProps = {
  position: "top-right",
  autoClose: 3500,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  toastStyle: {
    background: "#18181b",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#f4f4f5",
  },
};