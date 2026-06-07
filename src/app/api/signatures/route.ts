import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { SIGNATURE_COLORS } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorIdentifier = searchParams.get("visitor_identifier");
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("signatures")
      .select(`
        *,
        users (
          visitor_identifier
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const signatures = (data || []).map((signature: any) => {
      const { users, ...rest } = signature;
      return {
        ...rest,
        can_edit: Boolean(visitorIdentifier && users?.visitor_identifier === visitorIdentifier),
      };
    });

    return NextResponse.json({ signatures });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, author_name, note, color, visitor_identifier } = body;
    const trimmedName = typeof author_name === "string" ? author_name.trim() : "";
    const trimmedNote = typeof note === "string" ? note.trim() : "";
    const nextColor = SIGNATURE_COLORS.includes(color) ? color : "#3B3028";

    if (!id || !visitor_identifier || !trimmedName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (trimmedName.length > 30 || trimmedNote.length > 40) {
      return NextResponse.json({ error: "Signature text is too long" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("visitor_identifier", visitor_identifier)
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("signatures")
      .update({
        author_name: trimmedName,
        note: trimmedNote || null,
        color: nextColor,
      })
      .eq("id", id)
      .eq("user_id", userData.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Signature not found" }, { status: 404 });
    }

    return NextResponse.json({
      signature: {
        ...data,
        can_edit: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author_name, note, position_x, position_y, color, visitor_identifier } = body;

    if (!author_name || position_x === undefined || position_y === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();
    let user_id = null;

    if (visitor_identifier) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("visitor_identifier", visitor_identifier)
        .maybeSingle();

      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }

      if (userData) {
        user_id = userData.id;
      } else {
        const { data: createdUser, error: createUserError } = await supabase
          .from("users")
          .insert({
            name: author_name,
            avatar_url: null,
            visitor_identifier,
          })
          .select()
          .single();

        if (createUserError) {
          return NextResponse.json({ error: createUserError.message }, { status: 500 });
        }

        if (createdUser) {
          user_id = createdUser.id;
        }
      }
    }

    const { data, error } = await supabase
      .from("signatures")
      .insert({
        author_name,
        note: note || null,
        position_x,
        position_y,
        color: color || "#3B3028",
        user_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signature: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const visitorIdentifier = searchParams.get("visitor_identifier");

    if (!id || !visitorIdentifier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("visitor_identifier", visitorIdentifier)
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("signatures")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Signature not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
