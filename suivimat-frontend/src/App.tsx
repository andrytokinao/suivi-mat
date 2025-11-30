import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MaterialListPage from "./features/material/pages/MaterialListPage";
import MaterialCreateModal from "./features/material/pages/MaterialCreateModal.tsx";
import MaterialEditPage from "./features/material/pages/MaterialEditModal.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<MaterialListPage />} />
                    <Route path="/materials" element={<MaterialListPage />} />
                    <Route path="/materials/create" element={<MaterialCreateModal />} />
                    <Route path="/materials/:id/edit" element={<MaterialEditPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
