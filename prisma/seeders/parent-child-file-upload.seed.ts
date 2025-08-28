import { PrismaClient } from "@prisma/client";
import { StructureType } from "@/types/structure.type";
import { FileUploadCategory } from "@prisma/client";

import {
  createFakeFileUpload,
  createFakeFileUploadWithParent,
} from "./file-upload.seed";

const prisma = new PrismaClient();

/**
 * Creates parent-child file upload relationships for testing
 * This can be run as a standalone script or imported and used in other seeders
 */
export async function seedParentChildFileUploads(structureDnaCode: string) {
  // Get all FileUploadCategory values
  const categories = Object.values(FileUploadCategory);

  // Create parent file uploads for each category
  const parentUploads = await Promise.all(
    categories.map(() =>
      prisma.fileUpload.create({
        data: {
          ...createFakeFileUpload({
            category: FileUploadCategory.AUTRE,
            cpom: false,
            structureType: StructureType.CADA, // Default structure type
          }),
          structureDnaCode,
        },
      })
    )
  );
  // Create child file uploads for each parent
  const childrenByParent = await Promise.all(
    parentUploads.map(async (parent) => {
      // Generate random number between 1 and 10 for number of children
      const childCount = Math.floor(Math.random() * 3);

      // Create the specified number of children for this parent
      const children = await Promise.all(
        Array(childCount)
          .fill(null)
          .map(() =>
            prisma.fileUpload.create({
              data: {
                ...createFakeFileUploadWithParent({
                  parentFileUploadId: parent.id,
                }),
                structureDnaCode,
                // Ensure child category matches parent category
                category: parent.category,
              },
            })
          )
      );

      return children;
    })
  );

  // Flatten the array of child arrays
  const allChildren = childrenByParent.flat();

  return {
    parents: parentUploads,
    children: allChildren,
  };
}
