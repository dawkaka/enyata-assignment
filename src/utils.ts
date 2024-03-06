import ColorThief from "colorthief";

export function getDominantColor(imageUrl: string, callback: (color:any)=>void) {
    const img: HTMLImageElement = document.createElement("img");
    const colorThief = new ColorThief();
    img.setAttribute("src", imageUrl);
    img.crossOrigin = "Anonymous";
    if (img.complete) {
      callback(colorThief.getColor(img));
    } else {
      img.addEventListener("load", function () {
        callback(colorThief.getColor(img));
      });
    }
  }