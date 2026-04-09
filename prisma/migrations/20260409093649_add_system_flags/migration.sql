-- CreateTable
CREATE TABLE "SystemFlag" (
    "id" SERIAL NOT NULL,
    "votingEndsAt" TIMESTAMP(3),
    "isVotingClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemFlag_pkey" PRIMARY KEY ("id")
);
