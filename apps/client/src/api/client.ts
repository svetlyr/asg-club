import { ApiClient } from "@api";
import { SERVER_URL } from "astro:env/client";

export const serverApi = new ApiClient(SERVER_URL);
