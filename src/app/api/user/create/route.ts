// app/api/user/create/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, wantsToPlay } = await req.json();

    // Provjera da li korisnik već postoji
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik s tim imenom već postoji" },
        { status: 400 }
      );
    }

    // Kreacija novog korisnika
    const newUser = await prisma.user.create({
      data: {
        username, // Preuzimanje username-a od korisnika
        wantsToPlay, // Spremanje informacija o tome želi li sudjelovati
      },
    });

    return NextResponse.json({ success: true, userId: newUser.id }); // Vraćanje user ID-a
  } catch (error) {
    console.error("Greška pri kreiranju korisnika:", error);
    return NextResponse.json({ error: "Interna greška" }, { status: 500 });
  }
}
