import { SignOutButton } from "../lib/signout";
import Link from "next/link";

export default function SignOutPage() {
    return (
        <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 min-h-screen flex flex-col justify-center items-center">

            <div className="bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-neutral-800/90 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-10 shadow-2xl shadow-orange-500/10">

                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Sign Out
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Are you sure you want to leave?
                    </p>
                </div>

                <div className="flex justify-center items-center gap-10">
                    <SignOutButton />

                    <Link
                        href="/home"
                        className="w-fit py-4 px-6 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-all duration-300 border border-neutral-700 hover:border-neutral-600"
                    >
                        Cancel
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-orange-500/10">
                    <p className="text-center text-neutral-500 text-sm">
                        You can sign back in anytime to continue your creative work
                    </p>
                </div>
            </div>

            <div className="text-center mt-8">
                <p className="text-neutral-600 text-sm">
                    See you next time! 👋
                </p>
            </div>
        </div>
    );
}