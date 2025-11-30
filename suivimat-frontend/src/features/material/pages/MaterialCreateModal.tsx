import { useState, useEffect } from "react";
import MaterialForm from "../components/MaterialForm";
import type { Material } from "../types/Material";
import { createMaterial } from "../material.api";

interface Props {
    show: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function MaterialCreateModal({ show, onClose, onCreated }: Props) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [show]);

    const handleSubmit = async (data: Material) => {
        setLoading(true);
        try {
            await createMaterial(data);
            alert("Matériel créé avec succès !");
            onClose();
            onCreated();
        } catch (err: any) {
            alert(err.message || "Erreur lors de la création du matériel");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
            <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex={-1}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ajouter un matériel</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <MaterialForm
                                initialValues={{
                                    name: "",
                                    reference: "",
                                    serialNumber: "",
                                    description: "",
                                    status: "AVAILABLE",
                                    currentCondition: "GOOD",
                                }}
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
