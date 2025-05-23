import { LatLngTuple } from "leaflet";

// Center of France https://fr.wikipedia.org/wiki/Centre_de_la_France
export const FRANCE_CENTER: LatLngTuple = [46.6055983, 1.8750922];
export const DEFAULT_MAP_ZOOM = 6;

export const DEFAULT_PAGE_SIZE = 10;

// Cookie expiration times
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const FILE_UPLOAD_EXPIRATION_DELAY = 60 * 60; // 1 hour

export const SPREADSHEET_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.spreadsheet",
  "text/csv",
];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  ...SPREADSHEET_MIME_TYPES,
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

export const MODELE_DIFFUS_LINK =
  "https://docs.google.com/spreadsheets/d/1KZ2pfg94eHckhd0FpeAQovRP4lBNcSr3/edit";
export const MODELE_MIXTE_LINK =
  "https://docs.google.com/spreadsheets/d/12lipGpbF4GlUUViKBqjrtGL-UihiurDn/edit";
