// file: app/api/upload-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[]; // expect multiple files
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const publicUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabaseAdmin.storage.from("Laptops").upload(fileName, file);
      if (error) throw error;

      const { data: urlData } = supabaseAdmin.storage
        .from("Laptops")
        .getPublicUrl(fileName);
      publicUrls.push(urlData.publicUrl);
    }

    return NextResponse.json({ publicUrls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
