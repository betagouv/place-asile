export const getCoordinates = async (address: string): Promise<Coordinates> => {
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1`
      );

      if (result.status === 429) {
        // Rate limited, wait and retry
        console.warn(
          `Rate limited (429) for address: ${address}, attempt ${attempt}/${maxRetries}`
        );
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * attempt)
          );
          continue;
        }
      }

      if (!result.ok) {
        throw new Error(`HTTP ${result.status}: ${result.statusText}`);
      }

      const data = await result.json();
      const coordinates = data?.features?.[0]?.geometry?.coordinates;
      return {
        longitude: coordinates?.[0],
        latitude: coordinates?.[1],
      };
    } catch (error) {
      console.warn(
        `Failed to get coordinates for address: ${address}, attempt ${attempt}/${maxRetries}`,
        error
      );
      if (attempt === maxRetries) {
        return {
          longitude: undefined,
          latitude: undefined,
        };
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
    }
  }

  return {
    longitude: undefined,
    latitude: undefined,
  };
};

type Coordinates = {
  latitude: number | undefined;
  longitude: number | undefined;
};
