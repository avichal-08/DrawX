import type { existingClients } from "./types"

export const Participants = ({ existingClients }: { existingClients: existingClients[] }) => {
    return (
        <div className="bg-white rounded-2xl w-fit p-3 overflow-y-scroll scrollbar-hide">
            {existingClients.map((client) => {
                return (
                    <div className="bg-slate-200 w-fit p-2 rounded-2xl mb-1">
                        <div className="text-xl">
                            {client.name}
                        </div>
                        <div className="text-xs opacity-60">
                            {client.email}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}