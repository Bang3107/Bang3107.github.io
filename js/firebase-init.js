import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "../common/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseDB = db;
window.firebaseAddDoc = addDoc;
window.firebaseGetDocs = getDocs;
window.firebaseCollection = collection;
window.firebaseQuery = query;
window.firebaseOrderBy = orderBy;
window.firebaseLimit = limit;
window.firebaseServerTimestamp = serverTimestamp;

console.log("✅ Firebase initialized successfully");
