// TODO : UTILISATION EN FRONT :
// 
// const { validateFormStep } = useStepValidation();
// const handleValidateStep = async () => {
//   const result = await validateFormStep(formStep);
//   if (result === "OK") {
//     console.log('✅ Étape validée !');
//   } else {
//     console.error('❌ Erreur:', result);
//   }
// };

import { FormStep } from '@/types/form-step.type';

export const useStepValidation = () => {
    const validateFormStep = async (formStep: FormStep): Promise<string> => {
        try {
            const response = await fetch('/api/forms/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formStep
                })
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

    return {
        validateFormStep
    };
};