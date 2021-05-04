import React from "react";
import InstagramGallery from "./InstaGallery";
import "../../Styles/css/gallery.css";
import { getFromDatabase, updateDB } from "Helper/firebase";
import { refreshAccessToken } from "Helper/instagram";

const INSTAGRAM_ID = "45276714580";
const THUMBNAIL_WIDTH = 240;
const PHOTO_COUNT = 60;
const INITIAL_ACCESS_TOKEN =
  "IGQVJVZAGk4a1dBOE12MkdZAaTdkMGdvZAUVTajVwaDJYakRWWDFuY2hlMWZAiU2FTUjRrdHEzTXFpQVZArLU1WN1I2Yi1mQjYzMWk4WHV1aVoyY0FNUWVUWHlXYUlKRXVubmhiZAnVqMzQ3UUtEczZAGQXdibAZDZD";

function Gallery() {
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const igAccessToken = await getFromDatabase("igAccessToken");

      if (!igAccessToken) {
        /*TOKEN NOT SET*/
        updateDB({
          igAccessToken: { token: INITIAL_ACCESS_TOKEN, expiresIn: Date.now() + 2592000000 },
        });
        setToken(INITIAL_ACCESS_TOKEN);
      } else {
        if (Date.now() >= igAccessToken.expiresIn) {
          /*TOKEN EXPIRED*/
          const newToken = await refreshAccessToken(igAccessToken.token);
          updateDB({
            igAccessToken: {
              token: newToken.access_token,
              expiresIn: Date.now() + newToken.expires_in * 1000,
            },
          });
          setToken(newToken);
        } else {
          /*TOKEN SET AND STILL VALID*/
          setToken(igAccessToken.token);
        }
      }
    })();
  }, []);

  return (
    <div className="row gallery-container">
      <div className="col-md-5">
        <div className="gallery-header">Gallery</div>
      </div>
      <div className="col-md-7">
        <InstagramGallery
          accessToken={token}
          userId={INSTAGRAM_ID}
          thumbnailWidth={THUMBNAIL_WIDTH}
          photoCount={PHOTO_COUNT}
        />
      </div>
    </div>
  );
}

export default Gallery;
