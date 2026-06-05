import { NextResponse } from "next/server";
import { PLACEHOLDER_PHOTOS } from "@/lib/utils";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  // Fetch heart counts from Supabase
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

  // Return placeholder photos if no Drive credentials
  if (!apiKey || !folderId || apiKey.includes("your_")) {
    const photos = PLACEHOLDER_PHOTOS.map((url, i) => ({
      id: `placeholder-${i}`,
      image_url: url,
      drive_file_id: `placeholder-${i}`,
      caption: `Kỷ ức #${i + 1}`,
      heart_count: heartMap[`placeholder-${i}`] || 0,
    }));
    return NextResponse.json({ photos });
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,thumbnailLink,webContentLink)&pageSize=100`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!res.ok) {
      console.error("Google Drive API error:", data);
      throw new Error("Failed to fetch from Drive API");
    }

    const photos = (data.files || []).map((file: { id: string; name: string; thumbnailLink?: string; webContentLink?: string }) => ({
      id: file.id,
      // Use thumbnailLink from Google Drive API with higher resolution
      // This is the MOST reliable way for publicly shared files
      image_url: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s2000') : `https://drive.google.com/uc?id=${file.id}`,
      drive_file_id: file.id,
      caption: file.name.replace(/\.[^/.]+$/, ""),
      heart_count: heartMap[file.id] || 0,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching from Google Drive:", error);
    const photos = PLACEHOLDER_PHOTOS.map((url, i) => ({
      id: `placeholder-${i}`,
      image_url: url,
      drive_file_id: `placeholder-${i}`,
      caption: `Kỷ ức #${i + 1}`,
      heart_count: heartMap[`placeholder-${i}`] || 0,
    }));
    return NextResponse.json({ photos });
  }
}
