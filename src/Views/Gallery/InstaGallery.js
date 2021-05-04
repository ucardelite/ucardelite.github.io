import React, { Component } from "react";

const InstaGallery = ({ accessToken }) => {
  const [photos, setPhotos] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        if (accessToken) {
          const response = await fetch(
            `https://graph.instagram.com/me/media?access_token=${accessToken}&fields=media_url,media_type,caption,permalink`
          ).then((x) => x.json());
          if (response.data) {
            setPhotos(response.data.map((x) => ({ url: x.permalink, src: x.media_url })));
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [accessToken]);

  return (
    <div className="row">
      {photos.length
        ? photos.map(({ src, url }, i) => (
            <a
              href={url}
              target="_blank"
              className="col-lg-4 col-sm-4 col-md-6 col-6 mb-4"
              key={`insta-mediaObj-${i}`}
            >
              <div
                style={{
                  backgroundImage: `url(${src})`,
                  paddingBottom: "110%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </a>
          ))
        : null}
    </div>
  );
};

export default InstaGallery;
