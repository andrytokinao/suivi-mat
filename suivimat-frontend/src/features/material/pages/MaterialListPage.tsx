import { useEffect, useState } from "react";
import { deleteMaterial, getMaterials } from "../material.api";
import type { Material, MaterialStatus } from "../types/Material";
import MaterialCreateModal from "./MaterialCreateModal";
import MaterialEditModal from "./MaterialEditModal";

export default function MaterialListPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editMaterialId, setEditMaterialId] = useState<number | null>(null);

    const fetchMaterials = async () => {
        try {
            const data = await getMaterials();
            setMaterials(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setMaterials([]);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("Voulez-vous vraiment supprimer ce matériel ?")) return;
        try {
            await deleteMaterial(id);
            setMaterials(materials.filter((m) => m.id !== id));
        } catch (err: any) {
            alert(err.message || "Erreur lors de la suppression");
        }
    };

    const getStatusBadge = (status?: MaterialStatus | string) => {
        switch (status) {
            case "AVAILABLE":
                return <span className="badge bg-success">{status}</span>;
            case "IN_USE":
            case "UNDER_MAINTENANCE":
                return <span className="badge bg-info">{status}</span>;
            case "LOST":
            case "RETIRED":
                return <span className="badge bg-danger">{status}</span>;
            default:
                return <span className="badge bg-secondary">N/A</span>;
        }
    };

    return (
        <div className="container mt-5">
            {/* En-tête avec bouton unique */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Liste des matériels</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Ajouter un matériel
                </button>
            </div>

            {/* Modal création */}
            <MaterialCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={fetchMaterials}
            />

            {/* Modal édition */}
            {editMaterialId && (
                <MaterialEditModal
                    show={!!editMaterialId}
                    materialId={editMaterialId}
                    onClose={() => setEditMaterialId(null)}
                    onUpdated={fetchMaterials}
                />
            )}

            {/* Tableau des matériels */}
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Référence</th>
                    <th>Statut</th>
                    <th className="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                {materials.map((m) => (
                    <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.name}</td>
                        <td>{m.reference}</td>
                        <td>{getStatusBadge(m.status)}</td>
                        <td className="text-end">
                            <button
                                className="btn btn-sm btn-outline-primary me-2"
                                title="Modifier"
                                onClick={() => setEditMaterialId(m.id!)}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                title="Supprimer"
                                onClick={() => handleDelete(m.id)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
