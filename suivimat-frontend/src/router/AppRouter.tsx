import { BrowserRouter, Routes, Route } from "react-router-dom";
import MaterialListPage from "../features/material/pages/MaterialListPage";
import MaterialCreateModal from "../features/material/pages/MaterialCreateModal.tsx";
import MaterialEditPage from "../features/material/pages/MaterialEditModal.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/materials" element={<MaterialListPage />} />
                <Route path="/materials/create" element={<MaterialCreateModal />} />
                <Route path="/materials/edit/:id" element={<MaterialEditPage />} />
            </Routes>
        </BrowserRouter>
    );
}
