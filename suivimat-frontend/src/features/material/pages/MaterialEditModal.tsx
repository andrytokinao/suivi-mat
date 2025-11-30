import { useState, useEffect } from "react";
import MaterialForm from "../components/MaterialForm";
import type { Material } from "../types/Material";
import { getMaterialById, updateMaterial } from "../material.api";

interface Props {
    show: boolean;
    onClose: () => void;
    materialId: number;
    onUpdated: () => void;
}

export default function MaterialEditModal({ show, onClose, materialId, onUpdated }: Props) {
    const [material, setMaterial] = useState<Material | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [show]);

    useEffect(() => {
        if (!show) return;
        setLoading(true);
        getMaterialById(materialId)
            .then(setMaterial)
            .finally(() => setLoading(false));
    }, [materialId, show]);

    const handleSubmit = async (data: Material) => {
        if (!material) return;
        setLoading(true);
        try {
            await updateMaterial(materialId, data);
            alert("Matériel mis à jour avec succès !");
            onClose();
            onUpdated();
        } catch (err: any) {
            alert(err.message || "Erreur lors de la mise à jour du matériel");
        } finally {
            setLoading(false);
        }
    };

    if (!show || !material) return null;

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
            <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex={-1}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modifier le matériel</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <MaterialForm
                                initialValues={material}
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
