import React, { FC } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileEdit from "../components/ProfileEdit";
import { useDetailUser, useLoggedInUser } from "../utils/firebase";

const Profile: FC = () => {
    
    const user = useDetailUser()
    console.log(user)

    return(
        user ? <ProfileCard {...user}/> : null
    )
} 

export default Profile