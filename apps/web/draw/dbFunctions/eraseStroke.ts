import axios from "axios";

export function useEraseStroke(slug: string, isAdmin: boolean) {
    if (!slug || !isAdmin)
        return;

    const eraseStroke = async (strokeId: string) => {
        try {
            await axios.post("/api/strokes/erase", {
                eraseStrokeId: strokeId
            });
        } catch (error) {
            console.log(`failed to erase strokes in useEraseStrokes:${error}`);
        }
    }

    return eraseStroke;
}