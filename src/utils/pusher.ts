import Pusher from "pusher";

const pusher = new Pusher({
  appId: process?.env?.PUSHER_APP_ID ?? '',
  key: process?.env?.PUSHER_API_KEY ?? "",
  secret: process?.env?.PUSHER_API_SECRET ?? "",
  cluster: process?.env?.PUSHER_API_CLUSTER ?? "",
  useTLS: true
});

export default pusher;