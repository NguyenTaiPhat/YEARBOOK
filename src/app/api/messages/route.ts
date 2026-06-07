import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

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
    const { id, content, visitor_identifier } = body;
    const trimmedContent = typeof content === "string" ? content.trim() : "";

    if (!id || !visitor_identifier || !trimmedContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (trimmedContent.length > 1000) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
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

    const { data, error } = await supabase
      .from("messages")
      .update({ content: trimmedContent })
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
    const { author_name, content, visitor_identifier } = body;

    if (!author_name || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();
    let user_id = null;
    let avatar_url = null;

    if (visitor_identifier) {
      const { data: userData } = await supabase
        .from("users")
        .select("id, avatar_url")
        .eq("visitor_identifier", visitor_identifier)
        .maybeSingle();
      
      if (userData) {
        user_id = userData.id;
        avatar_url = userData.avatar_url;
      }
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        author_name,
        content,
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
