import { NextRequest } from "next/server";
import { getWixAdminClient } from "~/lib/wix-client.server";

export async function GET(req: NextRequest) {
    const fileName = req.nextUrl.searchParams.get("fileName");
    const mimeType = req.nextUrl.searchParams.get("mimeType");

    if(!fileName || !mimeType) {
        return new Response("Missing required query parameters", {
            status: 400
        })
    }

    const wixAdminClient = await getWixAdminClient()

    const { uploadUrl } = await wixAdminClient.files.generateFileUploadUrl(
        mimeType,
        {
            fileName,
            filePath: "product-reviews-media",
            private: false
        }
    )

    return Response.json({ uploadUrl })
}