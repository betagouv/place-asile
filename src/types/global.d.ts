export type Page = {
  params: Promise<{
    [key: string]: string;
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
};
