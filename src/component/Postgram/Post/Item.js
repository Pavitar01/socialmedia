import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,where
} from "firebase/firestore";
import { app } from "../../../firebaseconfig";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

const Item = ({ url, metadata, isNew }) => {
  const db = getFirestore(app);
  const [color, setColor] = useState("");
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [likes, setLikes] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    if (isNew) {
      setShowNewMessage(true);
      const timer = setTimeout(() => {
        setShowNewMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const auth=getAuth(app);
  useEffect(() => {
    // Retrieve the likes count from the metadata
    const likesCount = metadata?.customMetadata?.likes || 0;
    setLikes(likesCount);

    // Retrieve the comments array from the metadata
    const commentsArray = metadata?.customMetadata?.comments || [];
    setComments(commentsArray);
  }, [metadata]);

  const handleLike = async () => {
    const docRef = doc(db, metadata.fullPath);

    // Check if the document exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Document exists, proceed with the update
      const newLikesCount = color ? likes - 1 : likes + 1;
      setLikes(newLikesCount);
      setColor(color ? "" : "red");

      // Update the likes count in Firestore
      await updateDoc(docRef, {
        customMetadata: {
          ...metadata.customMetadata,
          likes: newLikesCount,
        },
      });

      // Add notification to the user who posted the photo
      const q1 = query(collection(db, "User"), where("uid", "==",  metadata?.customMetadata?.sId));
      const querysnap = await getDocs(q1);
      let docId = "";
      querysnap.forEach((doc) => (docId = doc.id));

      const userRef = doc(db, "User", docId);
      await updateDoc(userRef, {
        notifications: arrayUnion({
          type: "like",
          senderUID: auth.currentUser.uid, // Replace with the actual sender's UID
          photoURL: auth.currentUser.photoURL,
          name: auth.currentUser.displayName,
        }),
      });
    } else {
      // Document does not exist, create the document and set the likes count
      const newLikesCount = color ? likes - 1 : likes + 1;
      setLikes(newLikesCount);
      setColor(color ? "" : "red");

      // Create the document with the likes count
      await setDoc(docRef, {
        customMetadata: {
          likes: newLikesCount,
        },
      });
    }
  };

  const handleComment = () => {
    // Add the new comment to the comments array
    const newCommentsArray = [...comments, commentInput];
    setComments(newCommentsArray);
    setCommentInput("");

    // Update the comments array in Firestore
    updateDoc(doc(db, "images", metadata.fullPath), {
      customMetadata: {
        comments: arrayUnion(commentInput),
      },
    });
  };

  return (
    <div className="item">
      <div className="top">
        <div className="img" style={{ overflow: "hidden" }}>
          <img
            src={metadata?.customMetadata?.photo}
            width={50}
            height={50}
            alt="User"
          />
        </div>
        <div className="name">
          <h5>
            {metadata?.customMetadata?.addedBy || "Unknown User"}
            {showNewMessage && (
              <span
                className="new-message"
                style={{ marginLeft: "50px", color: "green" }}
              >
                New
              </span>
            )}
          </h5>
        </div>
      </div>
      <div className="middle">
        {metadata?.contentType?.includes("image") ? (
          <img src={url} alt={"image"} width="100%" height="100%" />
        ) : (
          <video controls style={{ width: "100%", height: "100%" }}>
            <source src={url} type={metadata?.contentType} />
          </video>
        )}
      </div>
      <div className="bottom" style={{ position: "relative" }}>
        <button onClick={handleLike}>
          <i className="fa-regular fa-heart" style={{ color: color }}></i>
        </button>
        <button>
          <i
            className="fa-regular fa-comment"
            onClick={() => {
              toggle ? setToggle(false) : setToggle(true);
            }}
          ></i>
        </button>
        {toggle ? (
          <>
            <div className="comments">
              <ul>
                {comments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
              <div className="add-comment">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={handleComment}>Post</button>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Item;
