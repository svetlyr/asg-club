import { ApiClient } from "@api";
import { SERVER_URL } from "astro:env/client";

const serverApi = new ApiClient(SERVER_URL);

export default serverApi;
