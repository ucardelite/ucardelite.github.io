import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternate";
import ButtonBase from "@material-ui/core/ButtonBase";
import "Styles/css/dropzone.css";

const MyDropzone = ({
  onFiles,
  files,
  accept = "",
  multiple = false,
  primary = false,
  onClick = () => {},
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <div onClick={onClick} {...getRootProps()} className="dropzone-container">
      <input {...getInputProps()} />
      <div className="text-center">
        <AddPhotoIcon className="add-image-icon"></AddPhotoIcon>
        <div className="add-image-text">DROP IMAGE HERE</div>
      </div>
    </div>
  );
};

export default MyDropzone;
