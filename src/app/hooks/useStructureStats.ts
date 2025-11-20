import { useEffect, useState } from "react";

export const useStructureStats = () => {
  const [maxPlacesAutorisees, setMaxPlacesAutorisees] = useState<number>(0);
  const [minPlacesAutorisees, setMinPlacesAutorisees] = useState<number>(0);

  const getStats = async (): Promise<{
    maxPlacesAutorisees: number;
    minPlacesAutorisees: number;
  }> => {
    try {
      const baseUrl = process.env.NEXT_URL || "";
      const result = await fetch(`${baseUrl}/api/structures/stats`);

      if (!result.ok) {
        throw new Error(
          `Failed to fetch max places autorisees: ${result.status}`
        );
      }

      const data = await result.json();
      return data;
    } catch (error) {
      console.error("Error fetching max places autorisees:", error);
      return { maxPlacesAutorisees: 0, minPlacesAutorisees: 0 };
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const { maxPlacesAutorisees, minPlacesAutorisees } = await getStats();
      setMaxPlacesAutorisees(maxPlacesAutorisees);
      setMinPlacesAutorisees(minPlacesAutorisees);
    };
    fetchStats();
  }, []);

  return { maxPlacesAutorisees, minPlacesAutorisees };
};
