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

    // const res = await fetch("http://localhost:3000", {
    //     method: "GET",
    //     headers: {
    //         cookie: `token=${customToken}`,
    //     },
    //     cache: "no-store",
    // });

    // if (!res.ok) {
    //     const errorText = await res.text();
    //     return (
    //         <div>
    //             <p>API call failed: {res.status} - {res.statusText}</p>
    //             <p>Response: {errorText}</p>
    //         </div>
    //     );
    // }

    // const data = await res.json();
    return(
        <div className="ml-80 mt-50">
            <h2 className="bg-black text-white text-xl rounded-2xl p-2 w-80 mb-5">Welcome!</h2>
            
            <p className="bg-black text-white text-xl rounded-2xl p-2 w-20 mb-5 cursor-pointer"><a href="/choice">Room</a></p>
            <a href="/" className="bg-black text-white text-xl rounded-2xl p-2 w-20 cursor-pointer">Home</a>
        </div>
    )
}