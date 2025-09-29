// src/app/lib/cloudrun-client.ts
import { GoogleAuth } from "google-auth-library";

// Base URL of your PRIVATE Cloud Run service (e.g., https://api-xyz-uc.a.run.app)
const CLOUD_RUN_URL = process.env.CLOUD_RUN_API_URL;

// Reuse a single auth client instance
const auth = new GoogleAuth();
let idTokenClient: Awaited<ReturnType<typeof auth.getIdTokenClient>> | null =
  null;

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

  if (!idTokenClient) {
    idTokenClient = await auth.getIdTokenClient(targetUrl);
  }

  const method = init?.method ?? "GET";
  const hasBody = init?.body !== undefined && init?.body !== null;

  const res = await idTokenClient.request({
    url: targetUrl,
    method,
    data: hasBody ? init!.body : undefined,
    headers: {
      "Content-Type": hasBody ? "application/json" : undefined,
    },
  });

  return res.data;
}
