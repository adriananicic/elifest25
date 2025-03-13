import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({ where: { wantsToPlay: true } });
    if (users.length < 4) {
      return NextResponse.json(
        { error: "Nedovoljno igrača za turnir" },
        { status: 400 }
      );
    }

    // Shuffle players and create teams
    const shuffledUsers = users.sort(() => Math.random() - 0.5);
    const { teamSize, numTeams, byeTeams } = getOptimalTeamSetup(users.length);
    const teams = [];

    for (let i = 0; i < numTeams * teamSize; i += teamSize) {
      const teamUsers = shuffledUsers.slice(i, i + teamSize);
      const team = await prisma.team.create({
        data: { users: { connect: teamUsers.map((u) => ({ id: u.id })) } },
      });
      teams.push(team);
    }

    // Create tournament
    const tournament = await prisma.tournament.create({
      data: {
        teams: { connect: teams.map((t) => ({ id: t.id })) },
        isActive: true,
      },
    });

    // Create knockout matches
    await createKnockoutRounds(tournament.id, teams, byeTeams);

    return NextResponse.json({ success: true, tournamentId: tournament.id });
  } catch (error) {
    console.error("Greška pri kreiranju turnira:", error);
    return NextResponse.json({ error: "Interna greška" }, { status: 500 });
  }
}

function getOptimalTeamSetup(playerCount: number) {
  const teamSizes = [3, 4, 5];
  let bestSetup = { teamSize: 4, numTeams: 0, byeTeams: 0 };
  let minByes = Infinity;

  for (const size of teamSizes) {
    const numTeams = Math.floor(playerCount / size);
    const closestPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numTeams)));
    const byeTeams = closestPowerOfTwo - numTeams;

    if (byeTeams < minByes) {
      minByes = byeTeams;
      bestSetup = { teamSize: size, numTeams, byeTeams };
    }
  }

  return bestSetup;
}

async function createKnockoutRounds(
  tournamentId: string,
  teams: any[],
  byeTeams: number
) {
  let roundNumber = 1;
  let currentTeams = [...teams];
  let previousMatches = [];

  // Add bye teams to next round
  for (let i = 0; i < byeTeams; i++) {
    previousMatches.push({ winnerId: currentTeams[i].id });
  }
  currentTeams = currentTeams.slice(byeTeams);

  while (currentTeams.length > 1) {
    const round = await prisma.round.create({
      data: { tournamentId, roundNumber },
    });

    let newMatches = [];
    for (let i = 0; i < currentTeams.length; i += 2) {
      if (i + 1 < currentTeams.length) {
        const match = await prisma.match.create({
          data: {
            roundId: round.id,
            team1Id: currentTeams[i].id,
            team2Id: currentTeams[i + 1].id,
          },
        });
        newMatches.push(match);
      }
    }

    previousMatches = newMatches;
    currentTeams = previousMatches.map((m) => ({ id: m.id }));
    roundNumber++;
  }
}
