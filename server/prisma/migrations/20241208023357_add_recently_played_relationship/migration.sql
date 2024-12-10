-- CreateTable
CREATE TABLE "RecentlyPlayed" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentlyPlayed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecentlyPlayed" ADD CONSTRAINT "RecentlyPlayed_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
