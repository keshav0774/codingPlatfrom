import { useState } from "react";
import {useForm} from 'react-hook-form';



export default function ChaiAi(){

   const [message, setMessage] = useState([
    {role: "Model", content: "Hi, I am Rio your Coding buddy?"}, 
    { role: "USer" , content : "I am Good...!"}
   ]); 

   const { register,handleSubmit,watch,formState: { errors }, } = useForm()
}