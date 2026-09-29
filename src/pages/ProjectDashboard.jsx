import { ProjectRow } from "../components/dashboard/project/ProjectRow";
import { useProjects } from "../hooks/useProject";
import Layout from "@/layout";
import { ProjectSkeleton, EmptyState, Button, Modal, Input, Textarea } from "@/components/ui";
import { Plus, Search } from "lucide-react"; // Importation de Search
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, updateProject } from "../api/projects.api";
import { useState } from "react";

const ProjectDashboard = () => {
  const { projects, isLoading, isError } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la barre de recherche
  const queryClient = useQueryClient();

  // 1. Mutation pour CRÉER
  const addMutation = useMutation({
    mutationFn: (data) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Erreur serveur détaillée:", error.response?.data);
      alert("Erreur lors de la création : " + (error.response?.data?.error?.message || "Vérifiez vos champs"));
    }
  });

  // 2. Mutation pour SUPPRIMER
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onError: () => alert("Erreur lors de la suppression.")
  });

  // 3. Mutation pour MODIFIER
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onError: () => alert("Erreur lors de la modification.")
  });

  // Filtrage des projets en fonction de la recherche
  // On utilise reverse() pour que le plus récent soit en haut si l'API envoie l'ancien en premier
  const filteredProjects = projects?.data
    ?.filter((p) => p.nom?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    addMutation.mutate(data);
  };

  const handleDelete = async (project) => {
    const projectId = project.id || project.documentId;
    if (window.confirm(`Supprimer "${project.nom}" ?`)) {
      deleteMutation.mutate(projectId);
    }
  };

  const handleEdit = async (project) => {
    const projectId = project.id || project.documentId;
    const nouveauNom = prompt("Nouveau nom :", project.nom);
    if (nouveauNom && projectId) {
      updateMutation.mutate({ id: projectId, data: { nom: nouveauNom } });
    }
  };

  if (isError) return <Layout><p className="text-center p-10 text-red-500">Erreur de chargement.</p></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-4">
        
        {/* BARRE DE RECHERCHE ET BOUTON CRÉER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Rechercher un projet..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#633BBC] focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="action" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2" /> Créer un projet
          </Button>
        </div>
        
        {/* HEADER / NAVIGATION DE LA LISTE */}
        <div className="grid grid-cols-[50px_1fr_120px_120px_150px_50px] px-4 py-3 bg-gray-50 rounded-t-xl border-x border-t border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <span className="flex justify-center">Selection</span>
          <span className="pl-6">Détails du projet</span>
          <span className="text-center">Progression</span>
          <span className="text-center">Statut</span>
          <span className="text-center">Date de création</span>
          <span></span>
        </div>

        <div className="mt-0 border-x border-b border-gray-100 rounded-b-xl overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-4"><ProjectSkeleton /></div>
          ) : filteredProjects?.length === 0 ? (
            <EmptyState /> 
          ) : (
            <div className="bg-white divide-y divide-gray-50">
              {filteredProjects.map((p) => (
                <ProjectRow 
                  key={p.id || p.documentId} 
                  project={p} 
                  onEdit={() => handleEdit(p)} 
                  onDelete={() => handleDelete(p)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* MODAL DE CRÉATION */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau projet">
          <form onSubmit={handleCreateProject} className="space-y-4 p-4">
            <Input label="Nom" name="nom" placeholder="Nom du projet" required />
            <Textarea label="Description" name="description" placeholder="Description du projet" />
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary">Annuler</Button>
              <Button variant="action" type="submit" isLoading={addMutation.isPending}>
                {addMutation.isPending ? "Création..." : "Créer le projet"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default ProjectDashboard;