import { PrismaClient, FileUploadCategory } from "@prisma/client";
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
    categories.map((category) =>
      prisma.fileUpload.create({
        data: {
          ...createFakeFileUpload({ category }),
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

/**
 * Run this function directly if you want to seed parent-child file uploads for testing
 * Example: npx ts-node prisma/seeders/parent-child-file-upload.seed.ts
 */
async function main() {
  try {
    // Get a structure to attach file uploads to
    const structure = await prisma.structure.findFirst();

    if (!structure) {
      console.error("No structures found. Please seed structures first.");
      return;
    }

    const result = await seedParentChildFileUploads(structure.dnaCode);

    console.log(
      `Created ${result.parents.length} parent file uploads (one for each category)`
    );
    console.log(
      `Created ${result.children.length} child file uploads (0-3 random children per parent)`
    );

    // Log details about children per category
    const childrenByCategory = result.children.reduce((acc, child) => {
      const category = child.category as string;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("Children per category:");
    Object.entries(childrenByCategory).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} children`);
    });
  } catch (error) {
    console.error("Error seeding parent-child file uploads:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  main();
}
