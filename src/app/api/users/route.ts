import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitor_identifier = searchParams.get("visitor_identifier");

    const supabase = createServerClient();

    // No identifier → return ALL users (for Contributors section)
    if (!visitor_identifier) {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url, memory_message, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ users: data ?? [] });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("visitor_identifier", visitor_identifier)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, avatar_url, memory_message, visitor_identifier } = body;

    if (!name || !visitor_identifier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();
    let finalAvatarUrl = avatar_url;

    // Check if avatar_url is a base64 string to upload to Supabase Storage
    if (avatar_url && avatar_url.startsWith("data:image/")) {
      try {
        const matches = avatar_url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          
          const fileExtension = contentType.split("/")[1] || "png";
          const fileName = `${visitor_identifier}-${Date.now()}.${fileExtension}`;

          // Create the avatars bucket if it doesn't exist (gracefully ignore error if it exists)
          try {
            await supabase.storage.createBucket("avatars", { public: true });
          } catch {}

          // Upload to avatars bucket
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, buffer, {
              contentType,
              upsert: true,
            });

          if (uploadError) {
            console.error("Storage upload error:", uploadError);
          } else if (uploadData) {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from("avatars")
              .getPublicUrl(fileName);
            
            finalAvatarUrl = publicUrl;
          }
        }
      } catch (uploadErr) {
        console.error("Failed to upload avatar to storage:", uploadErr);
      }
    }

    // Upsert user into database
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          name,
          avatar_url: finalAvatarUrl,
          memory_message,
          visitor_identifier,
        },
        { onConflict: "visitor_identifier" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
