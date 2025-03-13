import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Extract data from request body instead of params
    const { scannedId, scannerId } = await req.json();

    console.log("Received Data:", { scannedId, scannerId });

    if (!scannerId || !scannedId) {
      return NextResponse.json(
        { error: "Missing scannerId or scannedId" },
        { status: 400 }
      );
    }

    // Check if both users exist
    const scanner = await prisma.user.findUnique({ where: { id: scannerId } });
    const scanned = await prisma.user.findUnique({ where: { id: scannedId } });

    if (!scanner || !scanned) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Create scan entry
    const scan = await prisma.scan.create({
      data: {
        scannerId,
        scannedId,
      },
    });

    return NextResponse.json({ success: true, scan });
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
