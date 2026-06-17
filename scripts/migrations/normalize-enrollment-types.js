import admin from "firebase-admin";

function isProgramSlug(slug) {
  return typeof slug === "string" && slug.length > 0 && !slug.includes("/");
}

async function run() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON path.");
  }

  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("Set FIREBASE_PROJECT_ID to the target Firebase project id.");
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  const db = admin.firestore();
  const snapshot = await db.collection("enrollments").get();

  let inspected = 0;
  let updated = 0;
  const batchSize = 400;
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    inspected += 1;
    const data = doc.data() || {};
    const purchasedOfferingSlug = String(data.purchasedOfferingSlug || "").trim();
    const programName = String(data.programName || "").trim();
    const programCourseSlugs = Array.isArray(data.programCourseSlugs)
      ? data.programCourseSlugs.filter((item) => typeof item === "string" && item.trim())
      : [];

    const programLike = isProgramSlug(purchasedOfferingSlug) && (programCourseSlugs.length > 1 || programName.length > 0);

    const enrollmentType = programLike ? "program" : "course";
    const nextProgramSlug = programLike ? (String(data.programSlug || "").trim() || purchasedOfferingSlug) : "";
    const nextPrimaryCourseSlug = String(data.primaryCourseSlug || "").trim() || String(data.courseId || "").trim();

    const needsUpdate =
      data.enrollmentType !== enrollmentType
      || String(data.programSlug || "") !== nextProgramSlug
      || String(data.primaryCourseSlug || "") !== nextPrimaryCourseSlug
      || (programLike && String(data.courseName || "").trim() !== (programName || String(data.courseName || "").trim()));

    if (!needsUpdate) {
      continue;
    }

    const updatePayload = {
      enrollmentType,
      programSlug: nextProgramSlug,
      primaryCourseSlug: nextPrimaryCourseSlug,
    };

    if (programLike && programName) {
      updatePayload.courseName = programName;
    }

    batch.update(doc.ref, updatePayload);
    batchCount += 1;
    updated += 1;

    if (batchCount >= batchSize) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(JSON.stringify({ inspected, updated }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
