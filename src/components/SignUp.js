import React, { useState, useEffect } from "react";
import { Link,Navigate,useNavigate } from "react-router-dom";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { db } from "../firebase";
const SignUp = () => {
  const [err, setErr] = useState(false);
  const navigate=useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db,"userChats",res.user.uid),{});
            navigate('/')
          });
        }
      );
    } catch (err) {
      setErr(true);
    }
  };

  const [display, setDisplay] = useState(false);
  useEffect(() => {
    setDisplay(false);
    const timeoutId = setTimeout(() => {
      setDisplay(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div
        className="register"
        style={{
          transform: display ? "translateY(0%)" : "translateY(200%)",
          transition: "all 0.5s",
        }}
      >
        <h1 className="logo">
          <span>
            <i>ChatSphere</i>
          </span>
        </h1>
        <h2>Sign UP</h2>
        <form onSubmit={handleSubmit}>
          <input type="name" placeholder="Enter name" />
          <input type="email" placeholder="Enter email" />
          <input type="password" placeholder="Enter password" />
          <input
            id="file"
            style={{ display: "none" }}
            type="file"
            placeholder="Enter image"
          />
          <label htmlFor="file">
            <img src={Add} width={35} alt="The img is not desplayed" />
            <span
              style={{
                color: "whitesmoke",
                fontFamily: "cursive",
                fontStyle: "oblique",
              }}
            >
              Add image
            </span>
          </label>
          <button>Register</button>
          {err && <span>Something went wrong</span>}
        </form>

        <h4>
          Already registered?
          <Link className="link" to="/Login">
            Login
          </Link>
        </h4>
      </div>
    </>
  );
};

export default SignUp;
