import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Mock } from "vitest";

import { StructureClientProvider } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import FinalisationIdentificationForm from "@/app/(authenticated)/structures/[id]/finalisation/01-identification/forms/FinalisationIdentificationForm";
import { PublicType, StructureState } from "@/types/structure.type";

import { createStructure } from "../../../../../../../tests/test-utils/structure.factory";
import { createContact } from "../../../../../../test-utils/contact.factory";

vitest.mock("next/navigation", () => ({
  useRouter: vitest.fn(),
}));

// vitest.mock("@/app/hooks/useStructures", () => ({
//   useStructures: () => ({
//     updateAndRefreshStructure: vitest
//       .fn()
//       .mockRejectedValue("Une erreur est survenue"),
//   }),
// }));

describe("FinalisationIdentificationForm", () => {
  const mockRouter = {
    push: vitest.fn(),
  };

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue(mockRouter);
    vi.spyOn(global, "fetch").mockRejectedValueOnce(
      new Error("Une erreur est survenue")
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithContext = (
    currentStep: number,
    structure = createStructure({})
  ) => {
    return render(
      <StructureClientProvider structure={structure}>
        <FinalisationIdentificationForm currentStep={currentStep} />
      </StructureClientProvider>
    );
  };

  it("should render information bar if structure state is 'à finaliser'", () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});

    // WHEN
    renderWithContext(currentStep, structure);

    // THEN
    const aVerifierTitle = screen.getByText("À vérifier");
    expect(aVerifierTitle).toBeInTheDocument();
    const aVerifierDescription = screen.getByText(
      "Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
    );
    expect(aVerifierDescription).toBeInTheDocument();
  });

  it("should not render information bar if structure state is 'finalisé'", async () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({ state: StructureState.FINALISE });

    // WHEN
    renderWithContext(currentStep, structure);

    // THEN
    const aVerifierTitle = await screen.queryByText("À vérifier");
    expect(aVerifierTitle).not.toBeInTheDocument();
    const aVerifierDescription = await screen.queryByText(
      "Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
    );
    expect(aVerifierDescription).not.toBeInTheDocument();
  });

  it("should show description block fields", () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});

    // WHEN
    renderWithContext(currentStep, structure);

    // THEN
    const descriptionBlock = screen.getByRole("group", {
      name: "Description",
    });
    const filialeToggle = within(descriptionBlock).getByRole("checkbox", {
      name: "Cette structure appartient-elle à une filiale d’opérateur (ex: YSOS, filiale de SOS) ?",
    });
    expect(filialeToggle).toBeInTheDocument();
    const structureType = within(descriptionBlock).getByRole("combobox", {
      name: "Type",
    });
    expect(structureType).toHaveAttribute("disabled");
    const operateur = within(descriptionBlock).getByRole("combobox", {
      name: "Opérateur",
    });
    expect(operateur).toBeInTheDocument();
    const dateCreation = within(descriptionBlock).getByText(
      "Date de création de la structure"
    );
    expect(dateCreation).toBeInTheDocument();
    const finessCode = within(descriptionBlock).getByRole("textbox", {
      name: "Code FINESS",
    });
    expect(finessCode).toBeInTheDocument();
    const publicType = within(descriptionBlock).getByRole("combobox", {
      name: "Public",
    });
    expect(publicType).toBeInTheDocument();
    const lgbtFvvTehInfo = within(descriptionBlock).getByText(
      "LGBT : Lesbiennes, Gays, Bisexuels et Transgenres – FVV : Femmes Victimes de Violences–TEH : Traîte des Êtres Humains"
    );
    expect(lgbtFvvTehInfo).toBeInTheDocument();
    const placesLabelisees = within(descriptionBlock).getByText(
      "Actuellement, la structure dispose-t-elle de places labellisées / spécialisées ?"
    );
    expect(placesLabelisees).toBeInTheDocument();
    const lgbtToggle = within(descriptionBlock).getByRole("checkbox", {
      name: "Actuellement, la structure dispose-t-elle de places labellisées / spécialisées ? LGBT FVV et TEH",
    });
    expect(lgbtToggle).toBeInTheDocument();
    const fvvTehToggle = within(descriptionBlock).getByRole("checkbox", {
      name: "FVV et TEH",
    });
    expect(fvvTehToggle).toBeInTheDocument();
    const cpomToggle = within(descriptionBlock).getByRole("checkbox", {
      name: "Actuellement, la structure fait-elle partie d’un CPOM ?",
    });
    expect(cpomToggle).toBeInTheDocument();
  });

  it("should show contacts block fields", () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});

    // WHEN
    renderWithContext(currentStep, structure);

    // THEN
    const contacts = screen.getByRole("heading", {
      level: 2,
      name: "Contacts",
    });
    expect(contacts).toBeInTheDocument();
    const contactInfo = screen.getByText(
      "Veuillez renseigner en contact principal la personne responsable de la structure et en contact secondaire la personne en charge du suivi opérationnel et/ou de la gestion budgétaire et financière."
    );
    expect(contactInfo).toBeInTheDocument();
    const contactPrincipalBlock = screen.getByRole("group", {
      name: "Contact principal",
    });
    const prenomContactPrincipal = within(contactPrincipalBlock).getByRole(
      "textbox",
      {
        name: "Prénom",
      }
    );
    expect(prenomContactPrincipal).toBeInTheDocument();
    const nomContactPrincipal = within(contactPrincipalBlock).getByRole(
      "textbox",
      {
        name: "Nom",
      }
    );
    expect(nomContactPrincipal).toBeInTheDocument();
    const fonctionContactPrincipal = within(contactPrincipalBlock).getByRole(
      "textbox",
      {
        name: "Fonction",
      }
    );
    expect(fonctionContactPrincipal).toBeInTheDocument();
    const emailContactPrincipal = within(contactPrincipalBlock).getByRole(
      "textbox",
      {
        name: "Email",
      }
    );
    expect(emailContactPrincipal).toHaveAttribute("type", "email");
    const telephoneContactPrincipal = within(contactPrincipalBlock).getByRole(
      "textbox",
      {
        name: "Téléphone",
      }
    );
    expect(telephoneContactPrincipal).toBeInTheDocument();

    const contactSecondaireBlock = screen.getByRole("group", {
      name: "Contact secondaire",
    });
    const prenomContactSecondaire = within(contactSecondaireBlock).getByRole(
      "textbox",
      {
        name: "Prénom",
      }
    );
    expect(prenomContactSecondaire).toBeInTheDocument();
    const nomContactSecondaire = within(contactSecondaireBlock).getByRole(
      "textbox",
      {
        name: "Nom",
      }
    );
    expect(nomContactSecondaire).toBeInTheDocument();
    const fonctionContactSecondaire = within(contactSecondaireBlock).getByRole(
      "textbox",
      {
        name: "Fonction",
      }
    );
    expect(fonctionContactSecondaire).toBeInTheDocument();
    const emailContactSecondaire = within(contactSecondaireBlock).getByRole(
      "textbox",
      {
        name: "Email",
      }
    );
    expect(emailContactSecondaire).toHaveAttribute("type", "email");
    const telephoneContactSecondaire = within(contactSecondaireBlock).getByRole(
      "textbox",
      {
        name: "Téléphone",
      }
    );
    expect(telephoneContactSecondaire).toBeInTheDocument();
  });

  it("should show all calendrier block fields if CPOM is true", () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({ cpom: true });

    // WHEN
    renderWithContext(currentStep, structure);

    // THEN
    const calendrier = screen.getByRole("heading", {
      level: 2,
      name: "Calendrier",
    });
    expect(calendrier).toBeInTheDocument();
    const periodeAutorisationBlock = screen.getByRole("group", {
      name: "Période d’autorisation en cours",
    });
    const dateDebutAutorisation = within(periodeAutorisationBlock).getByText(
      "Date de début"
    );
    expect(dateDebutAutorisation).toBeInTheDocument();
    const dateFinAutorisation = within(periodeAutorisationBlock).getByText(
      "Date de fin"
    );
    expect(dateFinAutorisation).toBeInTheDocument();
    const conventionBlock = screen.getByRole("group", {
      name: "Convention en cours (optionnel)",
    });
    const dateDebutConvention =
      within(conventionBlock).getByText("Date de début");
    expect(dateDebutConvention).toBeInTheDocument();
    const dateFinConvention = within(conventionBlock).getByText("Date de fin");
    expect(dateFinConvention).toBeInTheDocument();
    const cpomBlock = screen.getByRole("group", {
      name: "CPOM en cours",
    });
    const dateDebutCpom = within(cpomBlock).getByText("Date de début");
    expect(dateDebutCpom).toBeInTheDocument();
    const dateFinCpom = within(cpomBlock).getByText("Date de fin");
    expect(dateFinCpom).toBeInTheDocument();
  });

  it("should display filiale field when filiale toggle is on", async () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});

    // WHEN
    renderWithContext(currentStep, structure);

    // THEN
    const descriptionBlock = screen.getByRole("group", {
      name: "Description",
    });
    const filialeToggle = within(descriptionBlock).getByRole("checkbox", {
      name: "Cette structure appartient-elle à une filiale d’opérateur (ex: YSOS, filiale de SOS) ?",
    });
    await act(() => {
      fireEvent.click(filialeToggle);
      const filialeField = within(descriptionBlock).getByRole("textbox", {
        name: "Filiale",
      });
      expect(filialeField).toBeInTheDocument();
    });
  });

  it.todo("should handle form submission successfully", async () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});
    const structureWithContacts = {
      ...structure,
      contacts: [createContact({}), createContact({})],
    };

    // WHEN
    renderWithContext(currentStep, structureWithContacts);

    // THEN
    await act(() => {
      const submitButton = screen.getByText("Étape suivante");
      fireEvent.click(submitButton);
      expect(mockRouter.push).toHaveBeenCalledOnce();
    });
  });

  it.todo("should handle submission error correctly", async () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});
    const structureWithContacts = {
      ...structure,
      contacts: [createContact({}), createContact({})],
    };

    // vitest.spyOn(useStructures, "useStructures").mockReturnValue({
    //   updateAndRefreshStructure: vitest
    //     .fn()
    //     .mockRejectedValue("Une erreur est survenue"),
    // });

    // WHEN
    renderWithContext(currentStep, structureWithContacts);

    // THEN
    await act(() => {
      const submitButton = screen.getByText("Étape suivante");
      fireEvent.click(submitButton);
      // expect(
      //   screen.getByText("Une erreur s’est produite.")
      // ).toBeInTheDocument();
    });
  });

  it("should pre-fill form with existing structure data", () => {
    // GIVEN
    const currentStep = 1;
    const structure = createStructure({});
    const structureWithContacts = {
      ...structure,
      cpom: true,
      contacts: [
        createContact({}),
        createContact({
          prenom: "John2",
          nom: "Doe2",
          email: "john2.doe2@example.com",
          telephone: "1234567890",
          role: "Directeur 2",
        }),
      ],
    };

    // WHEN
    renderWithContext(currentStep, structureWithContacts);

    // THEN
    expect(screen.getByDisplayValue("CADA")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Adoma")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2007-01-02")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(PublicType.TOUT_PUBLIC)
    ).toBeInTheDocument();
    const lgbtToggle = screen.getByRole("checkbox", {
      name: "Actuellement, la structure dispose-t-elle de places labellisées / spécialisées ? LGBT FVV et TEH",
    });
    expect(lgbtToggle).toBeChecked();
    const fvvTehToggle = screen.getByRole("checkbox", {
      name: "FVV et TEH",
    });
    expect(fvvTehToggle).not.toBeChecked();
    const cpomToggle = screen.getByRole("checkbox", {
      name: "Actuellement, la structure fait-elle partie d’un CPOM ?",
    });
    expect(cpomToggle).toBeChecked();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Directeur")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john2.doe2@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Directeur 2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2022-01-02")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-01-02")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-02")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2027-01-02")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-01-02")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2028-01-02")).toBeInTheDocument();
  });
});
