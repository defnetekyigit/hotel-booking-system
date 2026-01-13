import admin from "firebase-admin";
import path from "path";

function initFirebase() {
  if (admin.apps.length) return admin;

  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH; 
  // örn: "./firebase-service-account.json"

  if (saPath) {
    // local
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(path.resolve(saPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // cloud run / gcp
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  return admin;
}

export const firebaseAdmin = initFirebase();
