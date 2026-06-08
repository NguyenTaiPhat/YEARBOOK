import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { STICKY_COLORS } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorIdentifier = searchParams.get("visitor_identifier");
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        author_name,
        content,
        color,
        created_at,
        user_id,
        users (
          avatar_url,
          visitor_identifier
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const messages = (data || []).map((msg: any) => ({
      id: msg.id,
      author_name: msg.author_name,
      content: msg.content,
      color: msg.color || null,
      created_at: msg.created_at,
      user_id: msg.user_id,
      avatar_url: msg.users?.avatar_url || null,
      can_edit: Boolean(visitorIdentifier && msg.users?.visitor_identifier === visitorIdentifier),
    }));

    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, content, color, visitor_identifier } = body;
    const trimmedContent = typeof content === "string" ? content.trim() : "";

    if (!id || !visitor_identifier || (!trimmedContent && typeof color !== "string")) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (trimmedContent && trimmedContent.length > 10000) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const allowedColors = STICKY_COLORS.map((item) => item.bg);
    if (typeof color === "string" && !allowedColors.includes(color)) {
      return NextResponse.json({ error: "Invalid color" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, avatar_url")
      .eq("visitor_identifier", visitor_identifier)
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updates: any = {};
    if (trimmedContent) updates.content = trimmedContent;
    if (typeof color === "string") updates.color = color;

    const { data, error } = await supabase
      .from("messages")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userData.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: {
        ...data,
        avatar_url: userData.avatar_url,
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
    const { author_name, content, color, visitor_identifier } = body;

    if (!author_name || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const trimmedContent = typeof content === "string" ? content.trim() : "";
    if (!trimmedContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (trimmedContent.length > 10000) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const allowedColors = STICKY_COLORS.map((item) => item.bg);
    const nextColor = typeof color === "string" && allowedColors.includes(color) ? color : STICKY_COLORS[0].bg;

    const supabase = createServerClient();
    let user_id = null;
    let avatar_url = null;

    if (visitor_identifier) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, avatar_url")
        .eq("visitor_identifier", visitor_identifier)
        .maybeSingle();

      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }

      if (userData) {
        user_id = userData.id;
        avatar_url = userData.avatar_url;
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

      if (user_id) {
        const { data: existingMessages, error: existingError } = await supabase
          .from("messages")
          .select("id")
          .eq("user_id", user_id)
          .limit(1);

        if (existingError) {
          return NextResponse.json({ error: existingError.message }, { status: 500 });
        }

        if (existingMessages && existingMessages.length > 0) {
          return NextResponse.json({ error: "Bạn chỉ được gửi 1 note" }, { status: 400 });
        }
      }
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        author_name,
        content: trimmedContent,
        color: nextColor,
        user_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: {
        ...data,
        avatar_url,
      }
    });
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
      .from("messages")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
