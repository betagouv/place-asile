-- Objective: enable structure ordering in front-end
CREATE OR REPLACE VIEW :"SCHEMA"."structures_order" AS with dernier_millesime_structure_typologie as (
        select distinct on (st."structureDnaCode") st."structureDnaCode",
            st."placesAutorisees",
            st."date"
        from public."StructureTypologie" st
        order by st."structureDnaCode",
            st."date" desc
    ),
    structure_repartition as (
        select a."structureDnaCode",
            case
                when bool_and(
                    a.repartition = 'COLLECTIF'::public."Repartition"
                ) then 'COLLECTIF'
                when bool_and(a.repartition = 'DIFFUS'::public."Repartition") then 'DIFFUS'
                else 'MIXTE'
            end as bati
        from public."Adresse" a
        where a.repartition is not null
        group by a."structureDnaCode"
    )
select s.id,
    s."dnaCode",
    s."type"::public."StructureType",
    o."name",
    s."departementAdministratif",
    d."region",
    sr."bati",
    st."placesAutorisees",
    s."finConvention"
from public."Structure" s
    left join public."Operateur" o on o.id = s."operateurId"
    left join dernier_millesime_structure_typologie st on st."structureDnaCode" = s."dnaCode"
    left join structure_repartition sr on sr."structureDnaCode" = s."dnaCode"
    left join public."Departement" d on d."numero" = s."departementAdministratif"