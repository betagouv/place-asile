-- Objective: enable structure ordering in front-end
CREATE OR REPLACE VIEW:"SCHEMA"."structures_order" AS
WITH
  dernier_millesime_structure_typologie AS (
    SELECT DISTINCT
      ON (st."structureDnaCode") st."structureDnaCode",
      st."placesAutorisees",
      st."date"
    FROM
      public."StructureTypologie" st
    ORDER BY
      st."structureDnaCode",
      st."date" DESC
  ),
  structure_repartition AS (
    SELECT
      a."structureDnaCode",
      CASE
        WHEN BOOL_AND(a.repartition = 'COLLECTIF'::public."Repartition") THEN 'COLLECTIF'
        WHEN BOOL_AND(a.repartition = 'DIFFUS'::public."Repartition") THEN 'DIFFUS'
        ELSE 'MIXTE'
      END AS bati
    FROM
      public."Adresse" a
    WHERE
      a.repartition IS NOT NULL
    GROUP BY
      a."structureDnaCode"
  )
SELECT
  s.id,
  s."dnaCode",
  s."type"::public."StructureType",
  o."name",
  s."departementAdministratif",
  d."region",
  sr."bati",
  st."placesAutorisees",
  s."finConvention"
FROM
  public."Structure" s
  LEFT JOIN public."Operateur" o ON o.id = s."operateurId"
  LEFT JOIN dernier_millesime_structure_typologie st ON st."structureDnaCode" = s."dnaCode"
  LEFT JOIN structure_repartition sr ON sr."structureDnaCode" = s."dnaCode"
  LEFT JOIN public."Departement" d ON d."numero" = s."departementAdministratif"
