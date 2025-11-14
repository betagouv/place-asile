// TODO migrate cpoms with existing data
// global logic:
// if cpom bool and structures are in the same region and structures are linked to same operateur, they belong to the same cpom
// - data existing in structure :
//     - cpom ? → Déclenchement de création de l’association à un cpom
//     - debutCpom → Cpom.debutCpom
//     - finCpom → Cpom.finCpom
// - data existing in budget :
//     - date → création d’un CpomTypologie
//     - cumulResultatsNetsCPOM → CpomTypologie.cumulResultatNet
//     - repriseEtat → CpomTypologie.repriseEtat
//     - affectationReservesFondsDedies → CpomTypologie.affectationTotal
//     - reserveInvestissement → CpomTypologie.affectationReserveInvestissement
//     - chargesNonReconductibles → CpomTypologie.affectationChargesNonReproductibles
//     - reserveCompensationDeficits → CpomTypologie.affectationReserveCompensationDeficits
//     - reserveCompensationBFR → CpomTypologie.affectationReserveCouvertureBFR
//     - reserveCompensationAmortissements → CpomTypologie.affectationReserveCompensationAmortissements
//     - fondsDedies → CpomTypologie.affectationFondsDedies
//     - reportANouveau → CpomTypologie.affectationReportANouveau
//     - autre → CpomTypologie.affectationAutre
//     - commentaire → CpomTypologie.commentaire
// to fill the values, if they match all good, if not this is being discussed...
