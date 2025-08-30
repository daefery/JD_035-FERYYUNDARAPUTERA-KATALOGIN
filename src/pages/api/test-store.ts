import { createServerClient } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createServerClient();

    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Set the auth context
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res
        .status(401)
        .json({ error: "Invalid token", details: authError });
    }

    // Test store creation
    const testStoreData = {
      name: "Test Store",
      slug: `test-store-${Date.now()}`,
      description: "Test store for debugging",
      user_id: user.id,
    };

    const { data: store, error: storeError } = await supabase
      .from("stores")
      .insert([testStoreData])
      .select()
      .single();

    if (storeError) {
      console.error("Store creation error:", storeError);
      return res.status(500).json({
        error: "Failed to create store",
        details: storeError,
        user_id: user.id,
        test_data: testStoreData,
      });
    }

    // Clean up - delete the test store
    await supabase.from("stores").delete().eq("id", store.id);

    return res.status(200).json({
      success: true,
      message: "Store creation test successful",
      user_id: user.id,
      store_created: store,
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
