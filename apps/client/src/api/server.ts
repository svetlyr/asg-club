import { ApiClient } from "@api";
import { CMS_URL } from "astro:env/server";

const cmsApi = new ApiClient(`${CMS_URL}/api/`);

export default cmsApi;
