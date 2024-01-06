// pages/api/generateApiKey.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { ApiKeyGenerator } from "../../../../../../build/index"; // Adjust the path as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Extract parameters from the request
  const { username, password, panoramaURL } = req.query;

  try {
    // Initialize the ApiKeyGenerator with the provided Panorama URL
    const apiKeyGenerator = new ApiKeyGenerator(panoramaURL as string);

    // Use the SDK to generate the API key
    const apiKey = await apiKeyGenerator.generateApiKey(
      username as string,
      password as string,
    );

    // Send the API key back to the client
    res.status(200).json({ apiKey });
  } catch (error) {
    // Handle any errors
    console.error("Error in proxy API:", error);
    res.status(500).json({ error: "Error generating API key" });
  }
}
