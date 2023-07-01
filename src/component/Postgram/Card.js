import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import { app } from '../../firebaseconfig'
const Card = () => {
    const auth=getAuth(app)
  return (
    <div className='cards' style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:"9999999"}}>
  <img src={auth.currentUser.photoURL} width={80} height={80} style={{borderRadius:"100%"}}/>
  <h1>{auth.currentUser.displayName}</h1>
  <p>{auth.currentUser.email}</p>
      <button onClick={()=>{signOut(auth)}}> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
  )
}

export default Card
