import { MongoClient, type Db, type Collection, type Document } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "arefin_portfolio";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MONGO_CLIENT_OPTIONS = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

/**
 * Returns a cached MongoClient instance.
 * Fails gracefully and returns null if MONGODB_URI is not configured.
 */
export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the MongoClient
    // instance is preserved across HMR (hot module reloading).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, MONGO_CLIENT_OPTIONS);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, use a module-scoped variable for serverless connection pooling.
    if (!clientPromise) {
      client = new MongoClient(uri, MONGO_CLIENT_OPTIONS);
      clientPromise = client.connect();
    }
  }

  try {
    return await clientPromise;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Sanitize any accidental credentials from log messages
    const sanitized = errorMsg.replace(/\/\/[^@]+@/, "//***:***@");
    console.warn("MongoDB Atlas connection notice:", sanitized);
    return null;
  }
}

/**
 * Returns the MongoDB Db instance, or null if unconfigured/offline.
 */
export async function getDb(): Promise<Db | null> {
  const c = await getMongoClient();
  if (!c) return null;
  return c.db(dbName);
}

/**
 * Returns a typed MongoDB collection, or null if unconfigured/offline.
 */
export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<T>(name);
}

let indexesEnsured = false;

/**
 * Ensures optimal indexes are created on MongoDB collections.
 */
export async function ensureIndexes(): Promise<void> {
  if (indexesEnsured) return;
  const db = await getDb();
  if (!db) return;

  try {
    const projects = db.collection("projects");
    await projects.createIndex({ slug: 1 }, { unique: true });
    await projects.createIndex({ published: 1, order: 1 });
    await projects.createIndex({ featured: 1 });

    const posts = db.collection("posts");
    await posts.createIndex({ slug: 1 }, { unique: true });
    await posts.createIndex({ published: 1, date: -1 });

    const services = db.collection("services");
    await services.createIndex({ published: 1, order: 1 });

    const skills = db.collection("skills");
    await skills.createIndex({ published: 1, order: 1 });

    const submissions = db.collection("contact_submissions");
    await submissions.createIndex({ createdAt: -1 });
    await submissions.createIndex({ status: 1 });
    await submissions.createIndex({ archived: 1 });

    const analytics = db.collection("analytics_events");
    await analytics.createIndex({ timestamp: -1 });
    await analytics.createIndex({ event: 1, timestamp: -1 });
    await analytics.createIndex({ path: 1, timestamp: -1 });
    await analytics.createIndex({ projectSlug: 1, timestamp: -1 });
    await analytics.createIndex({ sessionId: 1, timestamp: -1 });

    const adminActivities = db.collection("admin_activities");
    await adminActivities.createIndex({ timestamp: -1 });

    indexesEnsured = true;
  } catch {
    // Non-blocking index creation failure
  }
}
