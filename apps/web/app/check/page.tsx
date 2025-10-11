import { cookies } from "next/headers";

export default async function Check(){
    const cookieStore = await cookies();
    let customToken = cookieStore.get("token")?.value;

    if (!customToken) {
        try {
            const nextAuthResponse = await fetch("http://localhost:4000/api/auth/nextauth-token", {
                headers: {
                    Cookie: cookieStore.toString()
                }
            });

            if (!nextAuthResponse.ok) {
                return (
                    <div>
                        <p>Error: Please login first at <a href="/">Home</a></p>
                        <p>NextAuth status: {nextAuthResponse.status}</p>
                    </div>
                );
            }

            const { nextAuthToken } = await nextAuthResponse.json();

            const tokenExchangeResponse = await fetch("http://localhost:3000/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nextAuthToken })
            });

            if (!tokenExchangeResponse.ok) {
                const error = await tokenExchangeResponse.text();
                return (
                    <div>
                        <p>Token exchange failed: {error}</p>
                    </div>
                );
            }

            const { token } = await tokenExchangeResponse.json();
            customToken = token;
            
        } catch (error) {
            return (
                <div>
                    <p>Authentication flow failed: {String(error)}</p>
                    <p>Please try logging in again at <a href="/">Home</a></p>
                </div>
            );
        }
    }
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
            <h2 className=" text-6xl md:text-7xl bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent font-semibold animate-pulse hover:scale-120 transition">Welcome!</h2>
            <div className="flex mt-5 gap-4">
                <p className="bg-orange-500 text-2xl rounded-2xl p-2 w-fit font-semibold cursor-pointer shadow-white shadow-xs hover:scale-105 transition"><a href="/choice">Room</a></p>
                <a href="/" className="bg-orange-500 text-2xl rounded-2xl p-2 w-fit font-semibold cursor-pointer shadow-white shadow-xs hover:scale-105 transition">Home</a>
            </div>
        </div>
    )
}