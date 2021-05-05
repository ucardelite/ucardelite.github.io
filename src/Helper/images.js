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

export const renderImage = (image, setLogo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUrl = await uploadImage(image);

      convertImageToSvg({ imageUrl })
        .then((res) => {
          if (res.svg) {
            const logoContainer = document.getElementById("logo-container");
            logoContainer.innerHTML = res.svg;
            let svgNode = logoContainer.querySelector("svg");
            svgNode.setAttribute("width", "100%");
            svgNode.setAttribute("height", "100%");
            svgNode.setAttribute("preserveAspectRatio", "none");
            svgNode.setAttribute("viewBox", `0 0 ${res.width} ${res.height}`);
            setLogo(svgNode.cloneNode(true));
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
  const logo = document.getElementById("logo-container");
  logo.innerHTML = "";
};

export const preloadImages = (images) => {
  images.forEach((x) => {
    var img = new Image();
    img.src = x;
  });
};
