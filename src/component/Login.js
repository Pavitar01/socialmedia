import React, { useState, useEffect } from "react";
import { app } from "../firebaseconfig";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { AddUser } from "../redux/slice";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import FrontPage from "./Postgram/FrontPage";

const LoginPage = () => {
  const db = getFirestore(app);

  const [user, setUser] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      dispatch(AddUser(data));
      setUser(data);
    });
  }, []);

  const auth = getAuth(app);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, provider);
      const user = res?.user;

      const q1 = query(collection(db, "User"), where("uid", "==", user?.uid));
      const querysnap = await getDocs(q1);

      if (querysnap.empty) {
        await addDoc(collection(db, "User"), {
          name: user.displayName,
          uid: user.uid,
          url: user.photoURL,
          Notification: [], // Initialize the notification field as an empty array
          flag: true,
          createdAt: serverTimestamp(),
        });
      } else {
        let docId = "";
        querysnap.forEach((doc) => (docId = doc.id));

        const userRef = doc(db, "User", docId);
        await updateDoc(userRef, {
          flag: true,
        });
      }
    } catch (err) {
      alert("Login Page: " + err);
    }
  };

  return (
    <>
      {user ? <FrontPage /> : <button className="gbutton" onClick={googleSignIn}>
        Google Signin
      </button>}
     
    </>
  );
};

export default LoginPage;
