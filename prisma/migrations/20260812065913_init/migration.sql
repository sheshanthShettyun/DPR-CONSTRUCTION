-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "targetDate" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "equipment" INTEGER NOT NULL,
    "crew" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "svgType" TEXT NOT NULL,
    "imageUrl" TEXT,
    "modulesJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "load" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "eta" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    CONSTRAINT "Stage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskColumn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TaskCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "columnId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "files" INTEGER NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "TaskCard_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "TaskColumn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "pct" REAL NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "changeAmount" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ExpenseSummary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "totalSpent" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "potentialSavings" INTEGER NOT NULL,
    "savingsRatePct" REAL NOT NULL,
    "savingsTargetPct" REAL NOT NULL,
    "sparklineFilled" INTEGER NOT NULL,
    "sparklineTotal" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Objective" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TEXT NOT NULL,
    "position" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UtilityStock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totalItems" INTEGER NOT NULL,
    "available" INTEGER NOT NULL,
    "lowStock" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

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

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
