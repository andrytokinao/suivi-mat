import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Tooltip } from "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
        (el) => new Tooltip(el)
    );
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);


