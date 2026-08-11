-- CreateTable
CREATE TABLE "ProjectIntake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "targetDate" TEXT NOT NULL,
    "crewSize" INTEGER NOT NULL,
    "scale" INTEGER NOT NULL,
    "siteConditions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "intakeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "Risk_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ProjectIntake" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "intakeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "phasePct" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "Milestone_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ProjectIntake" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
