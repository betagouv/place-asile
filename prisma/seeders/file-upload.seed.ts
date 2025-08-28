import { fakerFR as faker } from "@faker-js/faker";
import { generateDatePair } from "./seed-util";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { StructureType } from "@/types/structure.type";
import { DdetsFileUploadCategory, FileUpload } from "@prisma/client";

export const createFakeFileUpload = ({
  category,
  cpom,
  structureType,
}: CreateFakeFileUploadOptions): Omit<
  FileUpload,
  "id" | "structureDnaCode" | "controleId"
> => {
  return buildFakeFileUpload({
    category,
    cpom,
    structureType,
  });
};

export const createFakeFileUploadWithParent = ({
  parentFileUploadId,
}: CreateFakeFileUploadWithParentOptions): Omit<
  FileUpload,
  "id" | "structureDnaCode" | "controleId"
> => {
  return buildFakeFileUpload({
    parentFileUploadId,
  });
};

const getFakeFileUploadCategories = (
  cpom?: boolean,
  structureType?: StructureType
): DdetsFileUploadCategory[] => {
  const cpomValue = cpom ?? faker.datatype.boolean();
  const structureTypeValue =
    structureType ?? faker.helpers.enumValue(StructureType);
  const categories = Object.values(DdetsFileUploadCategory).filter(
    (category) => {
      if (isStructureAutorisee(structureTypeValue) && cpomValue) {
        return true;
      }
      if (isStructureAutorisee(structureTypeValue) && !cpomValue) {
        return category !== DdetsFileUploadCategory.CPOM;
      }
      if (isStructureSubventionnee(structureTypeValue) && cpomValue) {
        return (
          category !== DdetsFileUploadCategory.ARRETE_AUTORISATION &&
          category !== DdetsFileUploadCategory.ARRETE_TARIFICATION
        );
      }
      if (isStructureSubventionnee(structureTypeValue) && !cpomValue) {
        return (
          category !== DdetsFileUploadCategory.ARRETE_AUTORISATION &&
          category !== DdetsFileUploadCategory.ARRETE_TARIFICATION &&
          category !== DdetsFileUploadCategory.CPOM
        );
      }
      return true;
    }
  );

  return categories as DdetsFileUploadCategory[];
};

const buildFakeFileUpload = ({
  category,
  cpom,
  structureType,
  parentFileUploadId,
}: BuildFakeFileUploadOptions): Omit<
  FileUpload,
  "id" | "structureDnaCode" | "controleId"
> => {
  const fakeCategories = getFakeFileUploadCategories(cpom, structureType);
  const [startDate, endDate] = generateDatePair();
  const { mime, ext } = randomDocFile();
  const fileName = faker.system.commonFileName(ext);

  return {
    key: `${faker.string.uuid()}-${fileName}`,
    mimeType: mime,
    fileSize: faker.number.int({ min: 1, max: 100000 }),
    originalName: fileName,
    date: faker.date.past(),
    category: category ?? faker.helpers.arrayElement(fakeCategories),
    startDate,
    endDate,
    categoryName:
      category === DdetsFileUploadCategory.AUTRE ? faker.lorem.word() : null,
    parentFileUploadId: parentFileUploadId ?? null,
  };
};

const docMimeMap = [
  { mime: "application/pdf", ext: "pdf" },
  { mime: "application/msword", ext: "doc" },
  {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: "docx",
  },
  { mime: "application/vnd.oasis.opendocument.text", ext: "odt" },
  { mime: "application/vnd.oasis.opendocument.spreadsheet", ext: "ods" },
  { mime: "application/vnd.oasis.opendocument.presentation", ext: "odp" },
];

const randomDocFile = () => {
  return faker.helpers.arrayElement(docMimeMap);
};

type BuildFakeFileUploadOptions = {
  category?: DdetsFileUploadCategory;
  cpom?: boolean;
  structureType?: StructureType;
  parentFileUploadId?: number;
};

type CreateFakeFileUploadOptions = {
  category?: DdetsFileUploadCategory;
  cpom?: boolean;
  structureType?: StructureType;
  parentFileUploadId?: number;
};

type CreateFakeFileUploadWithParentOptions = {
  parentFileUploadId: number;
};
