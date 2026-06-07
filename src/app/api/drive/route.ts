export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
export async function GET() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!apiKey || !folderId) {
    console.error("Missing Google Drive credentials");
    return NextResponse.json({ photos: [] }, { status: 500 });
  }

  const heartMap: Record<string, number> = {};
  try {
    const supabase = createServerClient();
    const { data: dbPhotos } = await supabase
      .from("photos")
      .select("drive_file_id, heart_count")
      .not("drive_file_id", "is", null);

    if (dbPhotos) {
      dbPhotos.forEach((p) => {
        if (p.drive_file_id) {
          heartMap[p.drive_file_id] = p.heart_count || 0;
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch photo heart counts from Supabase:", err);
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,thumbnailLink,webContentLink)&pageSize=100`;
    const res = await fetch(url, { cache: "no-store", });
    const data = await res.json();
    console.log("Folder ID:", folderId);
    console.log("Files found:", data.files?.length);
    console.log("Drive response:", JSON.stringify(data, null, 2));
    if (!res.ok) {
      console.error("Google Drive API error:", data);
      return NextResponse.json({ photos: [] }, { status: 500 });
    }

    const photos = (data.files || []).map((file: { id: string; name: string; thumbnailLink?: string }) => ({
      id: file.id,
      image_url: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, "=s2000") : `https://drive.google.com/uc?id=${file.id}`,
      drive_file_id: file.id,
      caption: file.name.replace(/\.[^/.]+$/, ""),
      heart_count: heartMap[file.id] || 0,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching from Google Drive:", error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
