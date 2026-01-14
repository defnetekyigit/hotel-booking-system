import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUser = userCredential.user;

  // 🔴 KRİTİK SATIR
  const token = await firebaseUser.getIdToken();

  // 🔴 BACKEND İÇİN GEREKLİ
  localStorage.setItem("token", token);

  return firebaseUser;
}
