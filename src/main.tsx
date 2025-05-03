import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";

import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import axios from "axios";
import { API_ENDPOINT } from "./data/app.ts";
import AppContextProvider from "./context/app.tsx";
import { CartProvider } from "./context/CartContext.tsx";

axios.defaults.baseURL = API_ENDPOINT;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AppContextProvider>
        <CartProvider>
        <App />
        </CartProvider>
      </AppContextProvider>
      <Toaster richColors />
    </HashRouter>
  </StrictMode>
);
