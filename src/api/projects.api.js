const API_URL = import.meta.env.VITE_API_URL;

export const projectsAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/api/projets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (projectData, token) => {
    const response = await fetch(`${API_URL}/api/projets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nom: projectData.nom,
        description: projectData.description
      })
    });
    return response.json();
  }
};