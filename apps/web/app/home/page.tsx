import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NEXT_AUTH } from "../lib/auth";
import { FaArrowRight } from "react-icons/fa";
import { SignOutButton } from "../lib/signout";

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH);
  const name = session?.user.name;

  if (!session) {
    redirect("/");
  }

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col relative">
      <div className="absolute right-2 bottom-6"><SignOutButton/></div>
      <div className=" flex justify-between items-center border-b-1 border-b-white bg-black h-fit py-4 px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">DrawX</span>
        </div>
        <div className="text-white text-xl md:text-2xl font-semibold">
          <span>{name}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center flex-grow">
        <Link
          href="/home/create"
          className="bg-black text-white text-xl font-semibold rounded-2xl p-4 pt-7 w-fit cursor-pointer hover:bg-black/60 hover:scale-110"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Create A Room</span>
            <FaArrowRight />
          </div>
          <div className="mt-4">
            <span className="text-white text-xs font-normal">
              You will be the admin of the room and only you will
            </span>
            <br />
            <span className="text-white text-xs font-normal">
              have the access of the room in your all rooms section.
            </span>
          </div>
        </Link>
        <Link
          href="/home/join"
          className="bg-black text-white text-xl font-semibold rounded-2xl p-4 pt-7 w-fit cursor-pointer hover:bg-black/60 hover:scale-110"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Join A Room</span>
            <FaArrowRight />
          </div>
          <div className="mt-4">
            <span className="text-white text-xs font-normal">
              You will be able to chat and broadcast strokes but you
            </span>
            <br />
            <span className="text-white text-xs font-normal">
               will not have the access of the room for future use.
            </span>
          </div>
        </Link>
        <Link
          href="/home/history"
          className="bg-black text-white text-xl font-semibold rounded-2xl p-4 pt-7 w-fit cursor-pointer hover:bg-black/60 hover:scale-110"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">All Rooms</span>
            <FaArrowRight />
          </div>
          <div className="mt-4">
            <span className="text-white text-xs font-normal">
              Get access to all your rooms in which you were admin.    
            </span>
            <br />
            <span className="text-white text-xs font-normal">
              Get access to chats and drawings of all those rooms.    
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
