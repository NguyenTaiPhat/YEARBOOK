import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { drive_file_id, image_url, caption, visitor_identifier } = body;

    if (!drive_file_id || !visitor_identifier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Get or create photo entry in database
    let { data: photo, error: findError } = await supabase
      .from("photos")
      .select("*")
      .eq("drive_file_id", drive_file_id)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!photo) {
      const { data: newPhoto, error: createError } = await supabase
        .from("photos")
        .insert({
          drive_file_id,
          image_url: image_url || "",
          caption: caption || "",
          heart_count: 0,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      photo = newPhoto;
    }

    // 2. Check if user already hearted
    const { data: existingHeart, error: heartCheckError } = await supabase
      .from("photo_hearts")
      .select("*")
      .eq("photo_id", photo.id)
      .eq("visitor_identifier", visitor_identifier)
      .maybeSingle();

    if (heartCheckError) {
      return NextResponse.json({ error: heartCheckError.message }, { status: 500 });
    }

    let hearted = false;

    if (existingHeart) {
      // Delete heart reaction (unlike)
      const { error: deleteError } = await supabase
        .from("photo_hearts")
        .delete()
        .eq("id", existingHeart.id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
    } else {
      // Add heart reaction (like)
      const { error: insertError } = await supabase
        .from("photo_hearts")
        .insert({
          photo_id: photo.id,
          visitor_identifier,
        });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      hearted = true;
    }

    // 3. Get exact count of hearts
    const { count, error: countError } = await supabase
      .from("photo_hearts")
      .select("*", { count: "exact", head: true })
      .eq("photo_id", photo.id);

    const nextCount = countError ? (hearted ? photo.heart_count + 1 : Math.max(0, photo.heart_count - 1)) : count || 0;

    // 4. Update the photos table
    const { error: updateError } = await supabase
      .from("photos")
      .update({ heart_count: nextCount })
      .eq("id", photo.id);

    if (updateError) {
      console.error("Failed to update photo heart count:", updateError);
    }

    return NextResponse.json({ success: true, hearted, heart_count: nextCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
