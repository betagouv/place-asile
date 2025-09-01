ALTER TABLE "public"."AdresseTypologie"
RENAME COLUMN "nbPlacesTotal" TO "placesAutorisees";

ALTER TABLE "public"."Structure"
RENAME COLUMN "nbPlaces" TO "oldNbPlaces";
