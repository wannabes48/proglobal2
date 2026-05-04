import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Read service account from the root
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'CLTDG1xcGGTCjoMeLnvMz2Q4Lx02';

async function setAdmin() {
  try {
    console.log(`Setting admin claim for UID: ${uid}`);
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    // Verify it was set
    const user = await admin.auth().getUser(uid);
    console.log('Custom claims applied:', user.customClaims);
    console.log('Success! The user is now an admin.');
    process.exit(0);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    process.exit(1);
  }
}

setAdmin();
