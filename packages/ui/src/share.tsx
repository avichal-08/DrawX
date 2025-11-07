"use client";

import { useState } from "react";
import { FaCheckCircle, FaCopy } from "react-icons/fa";
export function Share({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(slug);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="flex flex-col justify-around items-center w-fit gap-4 p-8 bg-neutral-900 shadow-sm shadow-white  text-white rounded-xl">
            <div className="text-2xl font-semibold">ROOM SLUG :
                <span className="text-xl font-sans"> {slug}</span>
            </div>
            <button
                onClick={copyToClipboard}
                className="cursor-pointer flex flex-grow items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
            >
                {copied ? (
                    <>
                        <FaCheckCircle /> Copied
                    </>
                ) : (
                    <>
                        <FaCopy /> Copy Room Slug
                    </>
                )}
            </button>
        </div>
    )
}