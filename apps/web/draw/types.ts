export type Shape = { 
    type: "rect"; 
    x: number; 
    y: number; 
    width: number; 
    height: number 
} | { 
    type: "circle"; 
    centreX: number; 
    centreY: number; 
    radius: number 
} | { 
    type: "line"; 
    startX: number; 
    startY: number; 
    endX: number; 
    endY: number 
} | {
    type: "arrow";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} | { 
    type: "text"; 
    x: number; 
    y: number; 
    text: string 
};
