import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CustomTextField from "./CustomTextField";
import Checkbox from "@material-ui/core/Checkbox";
import { renderImage, removeLogo, getAspectRatio } from "Helper/images";
import LinearProgress from "@material-ui/core/LinearProgress";

function CustomizeItem({
  getValue,
  customText,
  textSize,
  customImage,
  customImageHeight,
  customImageWidth,
  keepLogoAspectRatio,
}) {
  const [state, setState] = useState({
    customText: customText || "",
    textSize: textSize || 20,
    logo: customImage || null,
    logoWidth: customImageWidth || 100,
    logoHeight: customImageHeight || 100,
    keepLogoAspectRatio: keepLogoAspectRatio || false,
  });

  const [loadingImage, setLoadingImage] = useState(false);

  const [imageContol, setImageControl] = useState(false);

  const handleFontSize = (e, value) => {
    setState({
      ...state,
      textSize: value,
    });
  };

  useEffect(() => {
    if (customImage) {
      setImageControl(true);
    }
  }, [customImage]);

  useEffect(() => {
    if (getValue) {
      getValue(state);
    }
  }, [state, setState]);

  const handleCustomText = (e) => {
    setState({
      ...state,
      customText: e.target.value,
    });
  };

  const handleImageWidth = (e, value) => {
    const dx = value / state.logoWidth;
    setState((prev) => ({
      ...prev,
      logoWidth: Math.max(value, 1),
      ...(state.keepLogoAspectRatio ? { logoHeight: Math.max(state.logoHeight * dx, 1) } : {}),
    }));
  };

  const handleImageHeight = (e, value) => {
    const dx = value / state.logoHeight;
    setState((prev) => ({
      ...prev,
      logoHeight: Math.max(value, 1),
      ...(state.keepLogoAspectRatio ? { logoWidth: Math.max(state.logoWidth * dx, 1) } : {}),
    }));
  };

  const handleImage = async (e) => {
    if (e.target.files.length) {
      const image = e.target.files[0];
      const imageUrl = URL.createObjectURL(image);
      const aspectRatio = await getAspectRatio(imageUrl);
      setLoadingImage(true);
      renderImage(image).then(() => setLoadingImage(false));
      if (aspectRatio > 500 / 300) {
        setState({
          ...state,
          logoHeight: 500 / aspectRatio,
          logoWidth: 500,
          logo: imageUrl,
        });
      } else {
        setState({
          ...state,
          logoHeight: 300,
          logoWidth: 300 * aspectRatio,
          logo: imageUrl,
        });
      }

      setImageControl(true);
    }
  };

  const handleRemoveLogo = () => {
    setState({
      ...state,
      logo: null,
    });
    setImageControl(false);
    removeLogo();
  };

  const handleAspectRatio = (e) => {
    setState({
      ...state,
      keepLogoAspectRatio: e.target.checked,
    });
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          onChange={handleImage}
        />
        <label htmlFor="contained-button-file" className="w-100">
          <div className="mb-2" style={{ fontSize: 12 }}>
            Please ensure the image you upload has a white background only. Any image uploaded with
            a different background will invert the image uploaded
          </div>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            style={{ color: "#333" }}
            component="span"
          >
            Upload Logo
          </Button>
        </label>
        {loadingImage ? (
          <div className="py-3">
            <LinearProgress></LinearProgress>
          </div>
        ) : null}

        {imageContol && (
          <>
            <div className="row">
              <div className="col-md-6">
                <Typography gutterBottom>Width</Typography>
                <Slider
                  max={600}
                  aria-label="custom thumb label"
                  defaultValue={100}
                  color="primary"
                  value={state.logoWidth}
                  onChange={handleImageWidth}
                />
              </div>
              <div className="col-md-6">
                <Typography gutterBottom>Height</Typography>
                <Slider
                  max={300}
                  aria-label="custom thumb label"
                  defaultValue={100}
                  color="primary"
                  value={state.logoHeight}
                  onChange={handleImageHeight}
                />
              </div>
              <div className="col-md-6 d-flex align-items-center mt-2">
                <Checkbox
                  checked={state.keepLogoAspectRatio}
                  onChange={handleAspectRatio}
                ></Checkbox>
                <Typography>Keep aspect ratio</Typography>
              </div>
            </div>
            <div className="row image-control justify-content-end">
              <Button variant="contained" color="secondary" onClick={handleRemoveLogo}>
                Remove Logo
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="col-md-12 custom-text">
        <CustomTextField label="Add Custom Text" value={customText} onChange={handleCustomText} />
      </div>
      <div className="col-md-12 custom-text">
        <Typography gutterBottom>Font Size</Typography>
        <Slider
          max="80"
          aria-label="custom thumb label"
          defaultValue={20}
          color="primary"
          onChange={handleFontSize}
        />
      </div>
    </div>
  );
}

export default CustomizeItem;
