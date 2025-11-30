import { useState, useEffect } from "react";
import type { Material, MaterialStatus, MaterialCondition } from "../types/Material";

interface MaterialFormProps {
    initialValues: Material;
    onSubmit: (data: Material) => void;
    loading?: boolean;
}

export default function MaterialForm({ initialValues, onSubmit, loading = false }: MaterialFormProps) {
    const [material, setMaterial] = useState<Material>(initialValues);

    const materialStatuses: MaterialStatus[] = [
        "AVAILABLE",
        "IN_USE",
        "UNDER_MAINTENANCE",
        "LOST",
        "RETIRED"
    ];

    const materialConditions: MaterialCondition[] = [
        "GOOD",
        "DAMAGED",
        "BROKEN",
        "IN_REPAIR"
    ];

    useEffect(() => {
        setMaterial(initialValues);
    }, [initialValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMaterial((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(material);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={material.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Référence</label>
                <input
                    type="text"
                    className="form-control"
                    name="reference"
                    value={material.reference || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Numéro de série</label>
                <input
                    type="text"
                    className="form-control"
                    name="serialNumber"
                    value={material.serialNumber || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    value={material.description || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Statut</label>
                <select
                    className="form-select"
                    name="status"
                    value={material.status || "AVAILABLE"}
                    onChange={handleChange}
                >
                    {materialStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">État actuel</label>
                <select
                    className="form-select"
                    name="currentCondition"
                    value={material.currentCondition || "GOOD"}
                    onChange={handleChange}
                >
                    {materialConditions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Chargement..." : "Enregistrer"}
            </button>
        </form>
    );
}
