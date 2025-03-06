export type EvenementIndesirableGrave = {
  id: number;
  structureDnaCode: string;
  numeroDossier: string;
  evenementDate: Date;
  declarationDate: Date;
  type: EvenementIndesirableGraveType;
};

enum EvenementIndesirableGraveType {
  VOL,
  COMPORTEMENT_VIOLENT,
  PROBLEME_RH,
}
