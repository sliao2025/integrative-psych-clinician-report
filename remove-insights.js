// Script to remove clinical_insights from a specific patient's profile
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function removeClinicalInsights() {
  const userId = "cmind42vm0005s60d71utvgxu";

  try {
    // Fetch the current profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      console.log("Profile not found for userId:", userId);
      return;
    }

    const profileJson = profile.json;

    // Check if clinical_insights exists
    if (profileJson && profileJson.clinical_insights) {
      console.log("Found clinical_insights, removing...");

      // Remove the field
      delete profileJson.clinical_insights;

      // Update the profile
      await prisma.profile.update({
        where: { userId },
        data: { json: profileJson },
      });

      console.log("Successfully removed clinical_insights from profile");
    } else {
      console.log("No clinical_insights field found in profile");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

removeClinicalInsights();
