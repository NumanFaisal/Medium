import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"


export const Appbar = () => {
    return <div className="border-b flex justify-between px-10 py-4 ">
        <Link to={'/blogs'} className="flex flex-col justify-center font-bold text-2xl">
            Medium
        </Link>
        <div>
        <Link to={'/publish'}>
            <button type="button" className="text-white bg-slate-700 mr-6  focus:outline-none focus:ring-4 focus:ring-slate-300 font-medium rounded-full text-sm px-8 py-2.5 text-center me-2 mb-2 ">Publish</button>
        </Link>
            <Avatar size="big" name="Numan" />
        </div>
    </div>
}