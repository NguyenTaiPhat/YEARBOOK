import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy endpoint for Google Drive images
 * This allows us to serve Drive images without CORS issues
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (!apiKey || !fileId) {
        return new NextResponse("Missing configuration", { status: 400 });
    }

    try {
        // First, get file metadata to get the download link
        const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${apiKey}&fields=webContentLink,mimeType`;
        const metadataRes = await fetch(metadataUrl);

        if (!metadataRes.ok) {
            console.error("Failed to fetch file metadata:", await metadataRes.text());
            return new NextResponse("File not found", { status: 404 });
        }

        const metadata = await metadataRes.json();

        // Download the actual file
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
        const imageRes = await fetch(downloadUrl);

        if (!imageRes.ok) {
            console.error("Failed to fetch image:", await imageRes.text());
            return new NextResponse("Failed to fetch image", { status: 500 });
        }

        // Get the image buffer
        const imageBuffer = await imageRes.arrayBuffer();

        // Return the image with proper headers
        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": metadata.mimeType || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error proxying image:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
