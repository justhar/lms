CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"content" varchar(1000) NOT NULL,
	"type" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deadline" timestamp,
	"subjectId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subjectName" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"teacherId" integer NOT NULL,
	"classId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"assignmentId" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"content" varchar(1000),
	"fileUrl" varchar(1000)[],
	"submittedAt" timestamp DEFAULT now() NOT NULL,
	"grade" integer,
	"feedback" varchar(1000),
	"userId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "class_members" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "classId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_subjectId_subjects_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_teacherId_users_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignmentId_posts_id_fk" FOREIGN KEY ("assignmentId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" DROP COLUMN "teacherId";