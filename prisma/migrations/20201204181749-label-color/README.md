# Migration `20201204181749-label-color`

This migration has been generated by MatheusDomingues at 12/4/2020, 3:17:49 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Label" ADD COLUMN "color" text   NOT NULL DEFAULT E'#b36fd8'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201123231924-model-comment..20201204181749-label-color
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -34,8 +34,9 @@
   id          Int      @default(autoincrement()) @id
   name        String   @unique
   description String?
   Bubbles     Bubble[]
+  color       String   @default("#b36fd8")
 }
 model Comment {
   id          Int      @default(autoincrement()) @id
```


