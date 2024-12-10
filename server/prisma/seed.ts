import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const playlist1 = await prisma.playlist.create({
    data: {
      name: "Morning Jazz",
      description: "Smooth, relaxing Jazz tunes to start your day.",
      genre: "Jazz",
      songs: {
        create: [
          {
            title: "deep in it",
            artist: "berlioz, Ted Jasper",
            album: "N/A",
            genre: "Jazz",
            mp3Url:
              "https://alex-fm.s3.eu-west-2.amazonaws.com/morning+jazz/deepinit.mp3",
            duration: 154,
            position: 1,
          },
          {
            title: "Breeze",
            artist: "Soul Media",
            album: "WaJazz",
            genre: "Jazz",
            mp3Url:
              "https://alex-fm.s3.eu-west-2.amazonaws.com/morning+jazz/breeze.mp3",
            duration: 275,
            position: 2,
          },
        ],
      },
      schedules: {
        create: [
          {
            startTime: new Date("2024-12-07T07:00:00Z"),
            duration: 180,
            dayOfWeek: 0,
          },
        ],
      },
    },
  })

  const playlist2 = await prisma.playlist.create({
    data: {
      name: "Soul Beats",
      description: "Smooth, gold soul music.",
      genre: "R&B/Soul",
      songs: {
        create: [
          {
            title: "Kiss of Life",
            artist: "Sade",
            album: "The Best of Sade",
            genre: "Soul",
            mp3Url:
              "https://alex-fm.s3.eu-west-2.amazonaws.com/soul+beats/kissoflife.mp3",
            duration: 251,
            position: 1,
          },
          {
            title: "Sweetest Taboo",
            artist: "Sade",
            album: "The Best of Sade",
            genre: "Soul",
            mp3Url:
              "https://alex-fm.s3.eu-west-2.amazonaws.com/soul+beats/sweetesttaboo.mp3",
            duration: 276,
            position: 2,
          },
        ],
      },
      schedules: {
        create: [
          {
            startTime: new Date("2024-12-07T10:00:00Z"),
            duration: 120,
            dayOfWeek: 0,
          },
        ],
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
