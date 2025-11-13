-- Objective: determine finalisation status per structure based on forms
CREATE OR REPLACE VIEW :"SCHEMA"."structures_filling" AS WITH -- Forms de finalisation par structure
  finalisation_forms AS (
    SELECT f."structureCodeDna" AS "dnaCode",
      f."id" AS "formId",
      f."status" AS "formStatus",
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM public."FormStep" fs
          WHERE fs."formId" = f."id"
            AND fs."status" = 'VALIDE'
        ) THEN true
        ELSE false
      END AS "hasValidatedStep"
    FROM public."Form" f
      INNER JOIN public."FormDefinition" fd ON fd."id" = f."formDefinitionId"
    WHERE fd."name" = 'finalisation'
  )
SELECT s."dnaCode",
  CASE
    WHEN ff."formId" IS NOT NULL
    AND ff."formStatus" = true THEN 'Finalisé agent' -- Finalisé agent : form existe et status = true
    WHEN ff."formId" IS NOT NULL
    AND ff."hasValidatedStep" = true THEN 'En cours agent' -- En cours agent : form existe et au moins un step est VALIDE
    WHEN ff."formId" IS NOT NULL THEN 'Finalisé opérateur' -- Finalisé opérateur : form existe
    ELSE 'Non commencé' -- Non commencé : pas de form
  END AS "finalisation_status",
  s."operateur" AS "operateur",
  s."type" AS "type",
  s."public" AS "public",
  s."region" AS "region",
  s."created_at" AS "created_at",
  s."updated_at" AS "updated_at"
FROM :"SCHEMA"."structures_aggregates" s
  LEFT JOIN finalisation_forms ff ON ff."dnaCode" = s."dnaCode";