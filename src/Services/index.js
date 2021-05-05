const apiUrl =
  process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_URL : "http://localhost:8888";

export const sendCards = ({
  name,
  provider,
  numberPosition,
  email,
  logoText,
  logoTextSize,
  logoX,
  logoY,
  logoTextX,
  logoTextY,
  logo,
  border,
}) => {
  return fetch(`${apiUrl}/api/sendCards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      provider,
      numberPosition,
      email,
      logoText,
      logoTextSize,
      logo,
      border,
      logoX,
      logoY,
      logoTextX,
      logoTextY,
    }),
  }).then((x) => x.json());
};

export const sendEmail = ({ message, email }) => {
  return fetch(`${apiUrl}/api/sendEmail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      email,
    }),
  }).then((x) => x.json());
};

export const convertImageToSvg = ({ imageUrl }) => {
  const body = {
    imageUrl,
  };

  const endPoint = `https://boiling-depths-34589.herokuapp.com/imageToSvg`;
  return fetch(endPoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((x) => x.json())
    .catch((er) => {
      return er;
    });
};
