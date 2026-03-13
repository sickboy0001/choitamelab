import { createTables } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await createTables();
    return NextResponse.json({ message: "Tables created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
