import type {Material} from "./types/Material.ts";

const MATERIAL_BASE_URL = "http://localhost:8080/api/materials";

export async function getMaterials() {
    const res = await fetch(MATERIAL_BASE_URL);
    if (!res.ok) throw new Error("Erreur lors de la récupération des matériels");
    return res.json();
}

export async function getMaterialById(id: number) {
    const res = await fetch(`${MATERIAL_BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération du matériel");
    return res.json();
}

export async function createMaterial(data: Material) {
    const res = await fetch(MATERIAL_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création du matériel");
    return res.json();
}

export async function updateMaterial(id: number, data: Material) {
    const res = await fetch(`${MATERIAL_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour du matériel");
    return res.json();
}

export async function deleteMaterial(id: number) {
    const res = await fetch(`${MATERIAL_BASE_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression du matériel");
    return true;
}
