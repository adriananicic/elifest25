import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { scannedId: string; scannerId: string } }
) {
  try {
    const { scannedId, scannerId } = params;

    // Provjera ako oba korisnika postoje
    const scanner = await prisma.user.findUnique({ where: { id: scannerId } });
    const scanned = await prisma.user.findUnique({ where: { id: scannedId } });

    if (!scanner || !scanned) {
      return NextResponse.json(
        { error: "Jedan ili oba korisnika nisu pronađena" },
        { status: 404 }
      );
    }

    // Kreiranje scan entiteta (konektiranje korisnika)
    const scan = await prisma.scan.create({
      data: {
        scannerId, // povezivanje korisnika koji skenira
        scannedId, // povezivanje korisnika kojeg je skenirao
        // Ovdje se ne koristi `scanner` i `scanned` u obliku objekta, samo `connect`
      },
    });

    return NextResponse.json({ success: true, scan });
  } catch (error) {
    console.error("Greška pri kreiranju skeniranja:", error);
    return NextResponse.json({ error: "Interna greška" }, { status: 500 });
  }
}
