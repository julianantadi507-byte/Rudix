import api from "./axios";

// Lire tous les projets
export const getProjects = () => {
  return api.get("/api/groupe-5/projets");
}

// Créer un projet
export const createProject = (data) => {
  // On s'assure d'envoyer un objet avec une clé 'data'
  return api.post("/api/groupe-5/projets", data);
};
// Supprimer un projet
export const deleteProject = (id) => {
  return api.delete(`/api/groupe-5/projets/${id}`);
}

// Modifier un projet
export const updateProject = (id, projectData) => {
  return api.put(`/api/groupe-5/projets/${id}`, projectData);
}