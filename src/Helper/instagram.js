export const refreshAccessToken = (prevAccessToken) => {
  return fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${prevAccessToken}`
  ).then((x) => x.json());
};
