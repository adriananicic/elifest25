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

    // Prevent duplicate scans
    const existingScan = await prisma.scan.findFirst({
      where: { scannerId, scannedId },
    });

    if (existingScan) {
      return NextResponse.json(
        { error: "User has already been scanned" },
        { status: 400 }
      );
    }

    // Create scan entry
    await prisma.scan.create({
      data: {
        scannerId,
        scannedId,
      },
    });

    // Check if the user has scanned all others
    const totalUsers = await prisma.user.count();
    const scansMade = await prisma.scan.count({
      where: { scannerId },
    });

    if (scansMade === totalUsers - 1) {
      // If user scanned everyone else, update reachedAllAt timestamp
      await prisma.user.update({
        where: { id: scannerId },
        data: { reachedAllAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
