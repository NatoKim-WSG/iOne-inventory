import { NextResponse } from "next/server";
import { getInventoryData, getSWIPCoordinates } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [data, swipCoords] = await Promise.all([
      getInventoryData(),
      getSWIPCoordinates(),
    ]);
    return NextResponse.json({ ...data, swipCoords });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}
