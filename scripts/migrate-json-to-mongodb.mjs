import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local or .env if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "arefin_portfolio";
const jsonPath = path.join(process.cwd(), "data", "db.json");

async function migrate() {
  if (!uri) {
    console.error("❌ Error: MONGODB_URI is not set");
    process.exit(1);
  }

  if (!fs.existsSync(jsonPath)) {
    console.log("No data/db.json file found to migrate.");
    return;
  }

  console.log("Reading data/db.json...");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const client = new MongoClient(uri, { maxPoolSize: 10 });
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db(dbName);

    if (data.siteSettings) {
      await db.collection("site_settings").updateOne({}, { $set: data.siteSettings }, { upsert: true });
      console.log("✓ Migrated site_settings");
    }

    if (data.about) {
      await db.collection("about").updateOne({}, { $set: data.about }, { upsert: true });
      console.log("✓ Migrated about");
    }

    if (Array.isArray(data.services) && data.services.length > 0) {
      for (const s of data.services) {
        const { id, _id, ...clean } = s;
        void id;
        void _id;
        await db.collection("services").updateOne({ title: s.title }, { $set: clean }, { upsert: true });
      }
      console.log(`✓ Migrated ${data.services.length} services`);
    }

    if (Array.isArray(data.skills) && data.skills.length > 0) {
      for (const sk of data.skills) {
        const { id, _id, ...clean } = sk;
        void id;
        void _id;
        await db.collection("skills").updateOne({ category: sk.category }, { $set: clean }, { upsert: true });
      }
      console.log(`✓ Migrated ${data.skills.length} skill categories`);
    }

    if (Array.isArray(data.projects) && data.projects.length > 0) {
      for (const p of data.projects) {
        const { id, _id, ...clean } = p;
        void id;
        void _id;
        await db.collection("projects").updateOne({ slug: p.slug }, { $set: clean }, { upsert: true });
      }
      console.log(`✓ Migrated ${data.projects.length} projects`);
    }

    if (Array.isArray(data.posts) && data.posts.length > 0) {
      for (const post of data.posts) {
        const { id, _id, ...clean } = post;
        void id;
        void _id;
        await db.collection("posts").updateOne({ slug: post.slug }, { $set: clean }, { upsert: true });
      }
      console.log(`✓ Migrated ${data.posts.length} blog posts`);
    }

    if (Array.isArray(data.submissions) && data.submissions.length > 0) {
      for (const sub of data.submissions) {
        const { id, _id, ...clean } = sub;
        void id;
        void _id;
        await db.collection("contact_submissions").insertOne(clean);
      }
      console.log(`✓ Migrated ${data.submissions.length} contact submissions`);
    }

    console.log("\n Migration to MongoDB Atlas finished successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await client.close();
  }
}

migrate();
