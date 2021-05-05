const { convertImageToSvg } = require("Services");
const { uploadImage } = require("Helper/firebase");

export const getAspectRatio = (objectUrl) => {
  return new Promise((resolve, reject) => {
    var img = new Image();

    img.onload = async function () {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };

    img.src = objectUrl;
  });
};

const drawInlineSVG = (canvas, rawSVG, aspectRatio) => {
  let svg = new Blob([rawSVG], { type: "image/svg+xml;charset=utf-8" });
  let url = URL.createObjectURL(svg);
  let img = new Image();

  const newWidth = aspectRatio > 500 / 300 ? 300 * aspectRatio : 500;
  const newHeight = aspectRatio <= 500 / 300 ? newWidth / aspectRatio : 300;

  img.onload = function () {
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    URL.revokeObjectURL(url);
  };

  img.src = url;
};

export const renderImage = (image, aspectRatio, setLogo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUrl = await uploadImage(image);

      convertImageToSvg({ imageUrl })
        .then((res) => {
          if ("svg" in res) {
            try {
              let container = document.createElement("div");
              container.innerHTML = res.svg;
              const svgNode = container.querySelector("svg");
              svgNode.setAttribute("width", res.width / 100);
              svgNode.setAttribute("height", res.height / 100);
              svgNode.setAttribute("preserveAspectRatio", "none");
              svgNode.setAttribute("viewBox", `0 0 ${res.width} ${res.height}`);
              const canvas = document.getElementById("logo-canvas");
              setLogo(container.innerHTML);
              drawInlineSVG(canvas, res.svg, aspectRatio);
            } catch (error) {
              console.log("error", error);
            }
          }

          resolve(true);
        })
        .catch((er) => resolve(true));
    } catch (er) {
      resolve(true);
    }
  });
};

export const removeLogo = () => {
  const canvas = document.getElementById("logo-canvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const preloadImages = (images) => {
  images.forEach((x) => {
    var img = new Image();
    img.src = x;
  });
};
