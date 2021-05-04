import "Styles/css/resourcecard.css";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useState, useEffect } from "react";
import Dropzone from "Components/Dropzone";
import { uploadImage } from "Helper/firebase";
import DeleteIcon from "@material-ui/icons/Delete";

const ResourceCard = ({ resource, onDelete, onUpdate, backgroundSize = "cover" }) => {
  const [edit, setEdit] = useState(false);
  const [values, setValues] = useState({ price: null, qty: null, image: null });
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setValues(resource);
    if (resource.image === "empty") {
      setEdit(true);
    }
  }, [resource]);
  return (
    <div className="resource-card position-relative">
      {edit ? (
        <DeleteIcon
          onClick={onDelete}
          className="position-absolute delete-icon"
          style={{ top: 10, right: 10, fontSize: 32, cursor: "pointer" }}
          fontSize="inherit"
        ></DeleteIcon>
      ) : null}

      {imageUploading ? (
        <div className="loader-container">
          <div>Uploading...</div>
        </div>
      ) : values.image === "empty" ? (
        edit ? (
          <Dropzone
            files={[]}
            onFiles={async (files) => {
              if (files.length) {
                setImageUploading(true);
                const res = await uploadImage(files[0]);
                setImageUploading(false);
                if (!res.error) {
                  setValues((prev) => ({ ...prev, image: res }));
                }
              }
            }}
          ></Dropzone>
        ) : (
          <div className="loader-container">Empty image</div>
        )
      ) : (
        <div
          className="resource-img"
          style={{ backgroundImage: `url(${values.image})`, backgroundSize }}
        ></div>
      )}

      <div className="flex-grow-1 d-flex align-items-center px-4 justify-content-between">
        <div className="mr-2">
          <div className="resource-prop-label">PRICE</div>
          <input
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                {
                  setValues((prev) => ({ ...prev, price: val }));
                }
              }
            }}
            disabled={!edit}
            placeholder="Enter"
            value={values.price !== "empty" ? values.price : ""}
            type="text"
            className="resource-prop"
          ></input>
        </div>
        <div className="mr-2">
          <div className="resource-prop-label">QUANTITY</div>
          <input
            placeholder="Enter"
            disabled={!edit}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                {
                  setValues((prev) => ({ ...prev, qty: val }));
                }
              }
            }}
            value={values.qty !== "empty" ? values.qty : ""}
            className="resource-prop"
            type="text"
          ></input>
        </div>
        {edit ? (
          <ButtonBase
            className="resource-outlined-btn"
            onClick={() => {
              onUpdate(values);
              setEdit(false);
            }}
          >
            SAVE
          </ButtonBase>
        ) : (
          <ButtonBase className="resource-outlined-btn" onClick={() => setEdit(true)}>
            EDIT
          </ButtonBase>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
