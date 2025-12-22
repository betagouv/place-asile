export const useStructureAdresseExistence = () => {
  const checkAdressesExistence = async (
    id: number
  ): Promise<boolean | string> => {
    try {
      const response = await fetch(`/api/structures/${id}/adresses/exists`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch adresses existence: ${response.status}`
        );
      }
      if (response.status < 400) {
        return await response.json();
      } else {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    checkAdressesExistence,
  };
};
