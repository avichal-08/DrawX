import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Check(){
    const cookieStore = await cookies();
    let customToken = cookieStore.get("token")?.value;

    if (customToken) {
        redirect('/home')
    }

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
                        <p>Error: Please login first</p>
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
                console.log(`Token exchange failed in auth-comp:${error}`)
                return (
                    <div>
                        <p>Authentication Failed! Please Try Again</p>
                    </div>
                );
            }

            const { token } = await tokenExchangeResponse.json();
            customToken = token;
            redirect('/home');
            
        } catch (error) {
            return (
                <div>
                    <p>Authentication failed</p>
                    <p>Please try logging in again</p>
                </div>
            );
        }
    }
}