import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import Item from "../Post/Item";
import { app } from "../../../firebaseconfig";
import { useSelector } from "react-redux";
import { storage } from "../../../firebaseconfig";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { v4 } from "uuid";
const Post = () => {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [trigger, setTrigger] = useState(false); 
  const [isToggle, setIsToggle] = useState(false); 

  const imageListRef = ref(storage, "images/");
  const user = useSelector((state) => state.userData.user);

  useEffect(() => {
    listAll(imageListRef)
      .then((res) => {
        const promises = res.items.map((i) =>
          Promise.all([
            getDownloadURL(ref(storage, i.fullPath)),
            getMetadata(ref(storage, i.fullPath)),
          ])
        );

        Promise.all(promises)
          .then((results) => {
            const updatedItems = results.map(([url, metadata], index) => ({
              url,
              name: res.items[index].name,
              metadata,
              isNew: false, // Initially set isNew as false for all items
            }));
            setItems(updatedItems);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error listing items:", error);
      });
  }, [trigger]);

  console.log(items);
  const handleAddItem = async () => {
    try {
      if (!file) return;

      const fileRef = ref(storage, `images/${file.name + v4()}`);

      // Check if the file is an image
      if (file.type.includes("image")) {
        uploadBytes(fileRef, file, {
          customMetadata: {
            addedBy: user.displayName,
            sId: user.uid,
            photo: user.photoURL,
            sec: 5,
          },
        }).then(() => {
          setTrigger((prev) => !prev); // Toggle trigger value to fetch updated data
        });
      }
      // Check if the file is a video
      else if (file.type.includes("video")) {
        uploadBytes(fileRef, file, {
          customMetadata: {
            addedBy: user.displayName,
            sId: user.uid,
            photo: user.photoURL,
          },
        }).then(() => {
          setTrigger((prev) => !prev); // Toggle trigger value to fetch updated data
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  console.log(items.name);
  return (
    <div className="post" style={{ position: "relative" }}>
      <div className="posts">
        {items.map((item) => (
          <Item
            key={item.id}
            url={item.url}
            metadata={item.metadata}
            isNew={item.isNew} // Pass the isNew property to Item component
          />
        ))}
      </div>
      <button
        style={{
          width: "50px",
          fontSize: "20px",
          borderRadius: "100%",
          height: "50px",
          border: "1px solid black",
          position: "absolute",
          cursor: "pointer",
          bottom:"20px"
        }}
        onClick={() => {
          isToggle ? setIsToggle(false) : setIsToggle(true);
        }}
      >
        +
      </button>
      {isToggle && (
        <div  style={{
              width: "300px",
              fontSize: "20px",
              height: "100px",
              border: "1px solid black",
              position: "absolute",
              cursor: "pointer",
              marginTop:"200px",
              backgroundColor:"white"
            }}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
           
            onClick={handleAddItem}
          >
            <h1 style={{ marginTop: "-1px" ,fontSize:"20px"}}>upload</h1>
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
