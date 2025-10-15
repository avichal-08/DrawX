import jsPDF from "jspdf";

export function handleDownload(format: "pdf" | "png" | "jpg") {
  const canvas = document.getElementById("draw-canvas") as HTMLCanvasElement;
  if (!canvas) return;

  const timestamp = new Date().toLocaleTimeString("en-GB").replaceAll(":", "-");

  if (format === "pdf") {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`drawx-${timestamp}.pdf`);
  } 
  else if (format === "png") {
    const link = document.createElement("a");
    link.download = `drawx-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } 
  else if (format === "jpg") {
    const link = document.createElement("a");
    link.download = `drawx-${timestamp}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();
  }
}
