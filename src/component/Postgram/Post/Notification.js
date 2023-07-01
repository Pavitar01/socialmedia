import {
    Firestore,
    collection,
    onSnapshot,
    where,
    query,
    orderBy,
    getFirestore,
  } from "firebase/firestore";
  import React, { useEffect, useState } from "react";
  import { app } from "../../../firebaseconfig";
  import { getAuth } from "firebase/auth";
  
  const Notification = () => {
    const [notify, setNotify] = useState([]);
    const db = getFirestore(app);
    const auth = getAuth(app);
  
    useEffect(() => {
      const q = query(collection(db, "User"), orderBy("createdAt", "asc"));
      const sub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filteredData = data.filter(
          (item) => item.uid !== auth.currentUser.uid
        );
        setNotify(filteredData[0]?.notifications || []);
      });
  
      return () => {
        sub();
      };
    }, [db, auth]);
  
    console.log(notify)
    return (
      <div className="cards" style={{ width: "500px" ,zIndex:"999999"}} >
        <h1 style={{ textAlign: "center" }} >Notify🔔</h1>
        {notify &&
          notify.map((item, index) => (
            <div key={index} className="list">
              <img src={item.photoURL} alt="User" />
              <h5>{item.name}</h5>
              <h5>{item.type} your post</h5>
            </div>
          ))}
      </div>
    );
  };
  
  export default Notification;
  