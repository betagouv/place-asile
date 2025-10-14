-- Objective: compare the number of places within the structure acccording to different sources:
-- - number of places by address by year
-- - activite (file from OFII)
-- - number of places by structure by year

CREATE OR REPLACE VIEW :"SCHEMA"."comparaison_places" AS
WITH -- Table on adresse typologie (millesimes adresses)
  places_par_structure AS (
    SELECT
      s."dnaCode",
      SUM(aty."placesAutorisees") AS total_places_autorisees
    FROM
      public."Structure" s
      JOIN public."Adresse" a ON a."structureDnaCode" = s."dnaCode"
      JOIN (
        SELECT DISTINCT
          ON ("adresseId") *
        FROM
          public."AdresseTypologie"
        ORDER BY
          "adresseId",
          "date" DESC
      ) aty ON aty."adresseId" = a.id
    GROUP BY
      s."dnaCode"
  ),
  -- Table on activite (from OFII)
  places_activite AS (
    SELECT
      s."dnaCode",
      SUM(ac."nbPlaces") AS total_places_activite
    FROM
      public."Structure" s
      JOIN public."Activite" ac ON ac."structureDnaCode" = s."dnaCode"
    GROUP BY
      s."dnaCode"
  ),
  -- Table on structure typologie (millesimes structures)
  places_structure_typologie AS (
    SELECT
      s."dnaCode",
      st."placesAutorisees" AS places_autorisees
    FROM
      public."Structure" s
      JOIN (
        SELECT DISTINCT
          ON ("structureDnaCode") *
        FROM
          public."StructureTypologie"
        ORDER BY
          "structureDnaCode",
          "date" DESC
      ) st ON st."structureDnaCode" = s."dnaCode"
  )
  -- Main join query
SELECT
  pps."dnaCode",
  pps.total_places_autorisees,
  pst.places_autorisees,
  pa.total_places_activite,
  pst.places_autorisees - pps.total_places_autorisees AS "diffPlaces",
  pa.total_places_activite - pps.total_places_autorisees AS "diffPlacesActivite",
  COALESCE(
    ABS(
      pst.places_autorisees - pps.total_places_autorisees
    ) / NULLIF(pst.places_autorisees::float, 0) * 100,
    0
  ) AS "pctDiffPlaces",
  COALESCE(
    ABS(
      pa.total_places_activite - pps.total_places_autorisees
    ) / NULLIF(pa.total_places_activite::float, 0) * 100,
    0
  ) AS "pctDiffPlacesActivite"
FROM
  places_par_structure pps
  JOIN places_structure_typologie pst ON pst."dnaCode" = pps."dnaCode"
  LEFT JOIN places_activite pa ON pa."dnaCode" = pps."dnaCode"
WHERE
  (
    pst.places_autorisees - pps.total_places_autorisees
  ) IS NOT NULL
  AND (
    pst.places_autorisees - pps.total_places_autorisees
  ) <> 0
ORDER BY
  "pctDiffPlaces" DESC;
