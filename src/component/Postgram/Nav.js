import React, { useState } from "react";
import Card from "./Card";
import Notification from "./Post/Notification";

const Nav = ({isChat,setIsChat}) => {
    const [toggle,setToggle]=useState(false)
    const [isNotify,setNotify]=useState(false)
  return (
    <div className="nav">
      <div className="left">
        <h1 style={{textAlign:"center"}}>Postgram</h1>
      </div>
      <div className="right">
        <button onClick={()=>toggle ? setToggle(false):setToggle(true)}>👤</button>
        <button onClick={()=>{isChat ? setIsChat(false):setIsChat(true)}}>🗨️</button>
        <button onClick={()=>{isNotify?setNotify(false):setNotify(true)}}>🔔</button>
        {
            toggle && <Card/>
        }
        {
            isNotify && <Notification/>
        }
      </div>

    </div>
  );
};

export default Nav;
