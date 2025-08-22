import { Operateur } from "@/types/operateur.type";

export function useOperateurSuggestion() {
  return async (query: string): Promise<OperateurSuggestion[]> => {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const response = await fetch(`/api/operateurs?search=${query}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.map((operateur: Operateur) => ({
        id: operateur.id,
        label: operateur.name,
        value: operateur.id,
      }));
    } catch (error) {
      console.error("Error fetching operateurs suggestions:", error);
      return [];
    }
  };
}

type OperateurSuggestion = Operateur & {
  id: string;
  label: string;
  key: string;
};
