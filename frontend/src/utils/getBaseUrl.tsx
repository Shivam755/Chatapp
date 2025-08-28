export const getBaseUrl = () => {
  let baseurl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseurl) {
    console.log(
      "Base api url is not set! Please set an environment variable with name NEXT_PUBLIC_API_URL"
    );
  }
  return baseurl;
};