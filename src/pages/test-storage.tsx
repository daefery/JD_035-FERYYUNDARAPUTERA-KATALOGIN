import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function TestStorage() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);

  const testStorageAccess = async () => {
    if (!user) {
      setTestResult("❌ User not authenticated");
      return;
    }

    setIsTesting(true);
    setTestResult("Testing storage access...");

    try {
      // Test 1: List files in store_data bucket
      const { data: listData, error: listError } = await supabase.storage
        .from("store_data")
        .list("logos");

      if (listError) {
        setTestResult(`❌ List error: ${listError.message}`);
        return;
      }

      setTestResult(
        `✅ List successful. Found ${
          listData?.length || 0
        } files in logos folder`
      );

      // Test 2: Try to upload a small test file
      const testFile = new File(["test"], "test.txt", { type: "text/plain" });
      const testFileName = `test_${Date.now()}.txt`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("store_data")
        .upload(`test/${testFileName}`, testFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setTestResult(`❌ Upload error: ${uploadError.message}`);
        return;
      }

      setTestResult(`✅ Upload successful! File: ${uploadData.path}`);

      // Test 3: Try to delete the test file
      const { error: deleteError } = await supabase.storage
        .from("store_data")
        .remove([`test/${testFileName}`]);

      if (deleteError) {
        setTestResult(
          `⚠️ Upload worked but delete failed: ${deleteError.message}`
        );
        return;
      }

      setTestResult("✅ All tests passed! Storage is working correctly.");
    } catch (error) {
      setTestResult(`❌ Exception: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const checkBucketPolicies = async () => {
    setIsTesting(true);
    setTestResult("Checking bucket policies...");

    try {
      // This will help identify if it's a policy issue
      const { data, error } = await supabase.storage.from("store_data").list();

      if (error) {
        setTestResult(`❌ Policy check failed: ${error.message}`);
      } else {
        setTestResult(
          `✅ Bucket accessible. Found ${data?.length || 0} items in root`
        );
      }
    } catch (error) {
      setTestResult(`❌ Policy check exception: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Storage Test</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">User Status:</h2>
            <p className="bg-gray-100 p-2 rounded font-mono text-sm">
              {user
                ? `✅ Authenticated as ${user.email}`
                : "❌ Not authenticated"}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Storage Buckets:</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>store_data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>gallery</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <button
              onClick={checkBucketPolicies}
              disabled={isTesting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Check Bucket Policies
            </button>

            <button
              onClick={testStorageAccess}
              disabled={isTesting}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-2"
            >
              Test Storage Access
            </button>
          </div>

          {testResult && (
            <div className="mt-4 p-3 bg-gray-100 rounded font-mono text-sm">
              {testResult}
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">
              If you get RLS errors:
            </h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Go to your Supabase Dashboard</li>
              <li>2. Go to Storage → Policies</li>
              <li>
                3. Run the SQL from <code>database/storage_policies.sql</code>
              </li>
              <li>
                4. Make sure buckets are set to &quot;Public&quot; for read
                access
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
