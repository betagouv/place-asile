import { FileUpload, FileUploadCategory } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";
import { generateDatePair } from "./seed-util";

export const createFakeFileUpload = ({
  category,
}: CreateFakeFileUploadOptions): Omit<
  FileUpload,
  "id" | "structureDnaCode" | "controleId"
> => {
  const fakeCategory = faker.helpers.enumValue(FileUploadCategory);
  const fileName = faker.system.commonFileName();
  const [startDate, endDate] = generateDatePair();

  return {
    key: `${faker.string.uuid()}-${fileName}`,
    mimeType: faker.system.mimeType(),
    fileSize: faker.number.int({ min: 1, max: 100000 }),
    originalName: fileName,
    date: faker.date.past(),
    category: category ?? fakeCategory,
    startDate,
    endDate,
    categoryName:
      category === FileUploadCategory.AUTRE ? faker.lorem.word() : null,
    parentFileUploadId: null,
  };
};

export const createFakeFileUploadWithParent = ({
  parentFileUploadId,
}: CreateFakeFileUploadWithParentOptions): Omit<
  FileUpload,
  "id" | "structureDnaCode" | "controleId"
> => {
  const fakeCategory = faker.helpers.enumValue(FileUploadCategory);
  const fileName = faker.system.commonFileName();
  const [startDate, endDate] = generateDatePair();

  return {
    key: `${faker.string.uuid()}-${fileName}`,
    mimeType: faker.system.mimeType(),
    fileSize: faker.number.int({ min: 1, max: 100000 }),
    originalName: fileName,
    date: faker.date.past(),
    category: fakeCategory,
    startDate,
    endDate,
    categoryName:
      fakeCategory === FileUploadCategory.AUTRE ? faker.lorem.word() : null,
    parentFileUploadId,
  };
};

type CreateFakeFileUploadOptions = {
  category?: FileUploadCategory;
};

type CreateFakeFileUploadWithParentOptions = {
  parentFileUploadId: number;
};
