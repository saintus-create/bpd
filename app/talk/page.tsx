import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import nextDynamic from "next/dynamic";

// Fetch a fresh Hume access token per request. Without this the page is
// statically prerendered at build time and the (short-lived) token is baked
// into the static HTML.
export const dynamic = "force-dynamic";

const Chat = nextDynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error('Unable to get access token');
  }

  return (
    <div className={"grow flex flex-col"}>
      <Chat accessToken={accessToken} />
    </div>
  );
}
