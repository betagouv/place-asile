-- Objective: aggregate indicators per structure
CREATE OR REPLACE VIEW :"SCHEMA"."structures_aggregates" AS WITH -- Last typology by structure
  structure_typologie_dernier_millesime AS (
    SELECT DISTINCT ON (st."structureDnaCode") st."structureDnaCode",
      st."placesAutorisees",
      st."pmr",
      st."lgbt",
      st."fvvTeh",
      st."date"
    FROM public."StructureTypologie" st
    ORDER BY st."structureDnaCode",
      st."date" DESC
  ),
  -- Last typology by address
  adresse_typologie_dernier_millesime AS (
    SELECT DISTINCT ON (aty."adresseId") a."structureDnaCode",
      a."id" AS "adresse_id",
      aty."placesAutorisees",
      aty."qpv",
      aty."logementSocial",
      aty."date"
    FROM public."AdresseTypologie" aty
      JOIN public."Adresse" a ON a."id" = aty."adresseId"
    ORDER BY aty."adresseId",
      aty."date" DESC
  ),
  -- Last activite by structure
  activite_dernier_millesime AS (
    SELECT DISTINCT ON (sa."structureDnaCode") sa."structureDnaCode",
      sa."date",
      sa."nbPlaces"
    FROM public."Activite" sa
    ORDER BY sa."structureDnaCode",
      sa."date" DESC
  ),
  -- Aggregate by structure on the last typologies of addresses
  adresses_agregees AS (
    SELECT adm."structureDnaCode",
      COUNT(DISTINCT adm."adresse_id") AS nb_adresses,
      SUM(adm."placesAutorisees") AS places_autorisees_adresse,
      SUM(adm."qpv") AS qpv_adresse,
      SUM(adm."logementSocial") AS logement_social_adresse,
      MAX(adm."date") AS date_adresse
    FROM adresse_typologie_dernier_millesime adm
    GROUP BY adm."structureDnaCode"
  )
SELECT s."dnaCode" AS "dnaCode",
  s.latitude AS "latitude",
  s.longitude AS "longitude",
  s.public AS "public",
  s.type AS "type",
  sdm."placesAutorisees" AS "places_autorisees_structure",
  sdm."pmr" AS "pmr_structure",
  sdm."lgbt" AS "lgbt_structure",
  sdm."fvvTeh" AS "fvv_teh_structure",
  aa."places_autorisees_adresse" AS "places_autorisees_adresse",
  aa."qpv_adresse" AS "qpv_adresse",
  aa."logement_social_adresse" AS "logement_social_adresse",
  aa."date_adresse" AS "date_adresse",
  aa."nb_adresses" AS "nb_adresses",
  sdm."date" AS "date_structure",
  adm."nbPlaces" AS "nb_places_activite",
  d."region" AS "region",
  -- Differences and percentages
  COALESCE(sdm."placesAutorisees", 0) - COALESCE(aa."places_autorisees_adresse", 0) AS "diff_places_adresse",
  COALESCE(
    ABS(
      COALESCE(sdm."placesAutorisees", 0) - COALESCE(aa."places_autorisees_adresse", 0)
    ) / NULLIF(COALESCE(sdm."placesAutorisees", 0)::float, 0) * 100,
    0
  ) AS "pct_diff_places_adresse",
  COALESCE(adm."nbPlaces", 0) - COALESCE(sdm."placesAutorisees", 0) AS "diff_places_activite",
  COALESCE(
    ABS(
      COALESCE(adm."nbPlaces", 0) - COALESCE(sdm."placesAutorisees", 0)
    ) / NULLIF(COALESCE(adm."nbPlaces", 0)::float, 0) * 100,
    0
  ) AS "pct_diff_places_activite",
  s."createdAt" AS "created_at",
  s."updatedAt" AS "updated_at"
FROM public."Structure" s
  LEFT JOIN structure_typologie_dernier_millesime sdm ON sdm."structureDnaCode" = s."dnaCode"
  LEFT JOIN adresses_agregees aa ON aa."structureDnaCode" = s."dnaCode"
  LEFT JOIN activite_dernier_millesime adm ON adm."structureDnaCode" = s."dnaCode"
  LEFT JOIN public."Departement" d ON d."numero" = s."departementAdministratif";