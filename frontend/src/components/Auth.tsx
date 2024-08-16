import { Link, useNavigate } from "react-router-dom"
import  { ChangeEvent, useState } from "react";
import { SignupInput } from "@numanfaisal/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate()
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type == "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (e) {
            alert("Error while signing up")
            console.log("Error while signup : ", e)
        }
    }
    
    return <div  className="flex flex-col justify-center h-screen">
        <div className="flex justify-center">
            <div className="px-10">
                <div className="text-4xl font-bold">
                    Create an account
                </div>
                <div className="text-center text-[#949aa5] text-md font-semibold mt-2 mb-5">
                    {type == "signin" ? "Don't have an account? " : "Already have an account?  " }
                    <Link className="underline " to={type === "signin" ? "/signup" : "/signin"}>{type === "signin" ? "Sign up" : "Sign in"}</Link>
                </div>
                <div className="pt-5">
                    {type === "signup" ? <LabelledInput label="Username" placeholder="Enter your username" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput label="Email" placeholder="m@example.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="Enter password" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="mt-5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange:(e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({ label, placeholder, onChange, type}: LabelledInputType) {
    return <div >
            <label className="block mb-2 text-sm  text-black font-semibold">{label}</label>
            <input type={type ||"text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2" placeholder={placeholder} onChange={onChange} />
        </div>
}