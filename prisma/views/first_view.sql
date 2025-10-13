CREATE SCHEMA IF NOT EXISTS reporting;

CREATE OR REPLACE VIEW reporting."places_diff_view" AS
WITH
  places_par_structure AS (
    SELECT
      s."dnaCode",
      SUM(aty."placesAutorisees") AS total_places_autorisees
    FROM
      public."Structure" s
      JOIN public."Adresse" a ON a."structureDnaCode" = s."dnaCode"
      JOIN public."AdresseTypologie" aty ON aty."adresseId" = a.id
    GROUP BY
      s."dnaCode"
  ),
  places_activite AS (
    SELECT
      s."dnaCode",
      SUM(ac."nbPlaces") AS total_places_activite
    FROM
      public."Structure" s
      JOIN public."Activite" ac ON ac."structureDnaCode" = s."dnaCode"
    GROUP BY
      s."dnaCode"
  )
SELECT
  p."dnaCode",
  p.total_places_autorisees,
  s."oldNbPlaces",
  s."oldNbPlaces" - p.total_places_autorisees AS "diffPlaces",
  ABS(s."oldNbPlaces" - p.total_places_autorisees) / s."oldNbPlaces"::float * 100 AS "pctDiffPlaces"
FROM
  places_par_structure p
  JOIN public."Structure" s ON s."dnaCode" = p."dnaCode"
WHERE
  (s."oldNbPlaces" - p.total_places_autorisees) IS NOT NULL
  AND (s."oldNbPlaces" - p.total_places_autorisees) <> 0
ORDER BY
  "pctDiffPlaces" DESC;