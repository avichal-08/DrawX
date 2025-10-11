export const Left = ({ name, email }: { name: string; email: string }) => {
    return (
        <div className="bg-red-300 border-4 border-red-700 text white w-fit rounded-2xl p-2">
            <div className="text-xl">
                {name}
            </div>
            <div className="text-xs">
                {email}
            </div>
        </div>
    )
}