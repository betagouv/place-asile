// TODO : UTILISATION EN FRONT :
// 
// const { validateFormStep } = useStepValidation();
// const handleValidateStep = async () => {
//   const result = await validateFormStep({
//     structureDnaCode: "ABC123",
//     formName: "Formulaire Agent",
//     formVersion: 1,
//     stepLabel: "Étape 1",
//     status: StepStatus.COMMENCE
//   });
//   if (result === "OK") {
//     console.log('✅ Étape validée !');
//   } else {
//     console.error('❌ Erreur:', result);
//   }
// };

import { StepStatus } from '@/app/api/forms/types';

export type ValidateFormStepRequest = {
    structureDnaCode: string;
    formName: string;
    formVersion: number;
    stepLabel: string;
    status: StepStatus;
};

export const useStepValidation = () => {
    const validateFormStep = async (request: ValidateFormStepRequest): Promise<string> => {
        try {
            const response = await fetch('/api/forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (response.status < 400) {
                return "OK";
            } else {
                const result = await response.json();
                return JSON.stringify(result);
            }
        } catch (error) {
            console.error(error);
            return String(error);
        }
    };

    const getFormStep = async (structureDnaCode: string, stepLabel: string, formName: string, formVersion: number): Promise<unknown> => {
        try {
            const response = await fetch(
                `/api/forms?structureDnaCode=${encodeURIComponent(structureDnaCode)}&formName=${encodeURIComponent(formName)}&formVersion=${formVersion}&stepLabel=${encodeURIComponent(stepLabel)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status < 400) {
                const result = await response.json();
                return result.formStep;
            } else {
                const result = await response.json();
                throw new Error(JSON.stringify(result));
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getFormsByStructure = async (structureDnaCode: string): Promise<unknown> => {
        try {
            const response = await fetch(
                `/api/forms?structureDnaCode=${encodeURIComponent(structureDnaCode)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status < 400) {
                const result = await response.json();
                return result.forms;
            } else {
                const result = await response.json();
                throw new Error(JSON.stringify(result));
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateFormStep = async (structureDnaCode: string, stepLabel: string, formName: string, formVersion: number, status: StepStatus): Promise<unknown> => {
        try {
            const response = await fetch('/api/forms', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    structureDnaCode,
                    stepLabel,
                    formName,
                    formVersion,
                    status
                })
            });

            if (response.status < 400) {
                const result = await response.json();
                return result.formStep;
            } else {
                const result = await response.json();
                throw new Error(JSON.stringify(result));
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        validateFormStep,
        getFormStep,
        getFormsByStructure,
        updateFormStep
    };
};