export const useStructureAdresseExistence = () => {
  const checkAdressesExistence = async (
    id: number
  ): Promise<boolean | string> => {
    try {
      const response = await fetch(`/api/structures/${id}/adresses/exists`, {
        method: "HEAD",
      });
      if (!response.ok && response.status !== 404) {
        throw new Error(
          `Failed to fetch adresses existence: ${response.status}`
        );
      }

      return response.status === 200;
    } catch (error) {
      throw error;
    }
  };

  return {
    checkAdressesExistence,
  };
};
