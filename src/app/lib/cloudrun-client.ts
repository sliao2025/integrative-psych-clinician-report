// src/app/lib/cloudrun-client.ts
// Base URL of your PRIVATE Cloud Run service (e.g., https://api-xyz-uc.a.run.app)
const CLOUD_RUN_URL = process.env.CLOUD_RUN_API_URL;

/**
 * Call a PRIVATE Cloud Run endpoint with an identity token.
 * Example: await fetchFromCloudRun("/api/clinician/patients?name=Jane%20Doe")
 */
export async function fetchFromCloudRun(
  endpointPathAndQuery: string,
  init?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
  }
): Promise<any> {
  if (!CLOUD_RUN_URL) {
    throw new Error("CLOUD_RUN_API_URL is not set");
  }

  // Ensure path joins correctly
  const targetUrl =
    CLOUD_RUN_URL.replace(/\/+$/, "") +
    "/" +
    endpointPathAndQuery.replace(/^\/+/, "");

  const method = init?.method ?? "GET";
  const hasBody = init?.body !== undefined && init?.body !== null;

  const res = await fetch(targetUrl, {
    method,
    headers: {
      "Content-Type": hasBody ? "application/json" : "",
    },
    body: hasBody ? JSON.stringify(init!.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API call failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
