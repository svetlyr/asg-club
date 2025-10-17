"use server";

import env from "@env";
import tryCatch from "@utils/tryCatch";

const owner = "svetlyr";
const repo = "asg-club";
const eventType = "deploy-from-cms";
const token = env.GITHUB_CLIENT_DEPLOY_PAT;
const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

const requestHeaders: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
};

type Result = [{ status: number; requestId: string | null; eventType: string }, null] | [null, Error];

export default async function deployClient(): Promise<Result> {
    const body = JSON.stringify({
        event_type: eventType,
    });

    const [response, error] = await tryCatch(
        fetch(url, { cache: "no-store", method: "POST", headers: requestHeaders, body }),
    );

    if (error) {
        return [null, error];
    }

    const { status, headers } = response;
    const requestId = headers.get("x-github-request-id");

    const data = { status, requestId, eventType };
    return [data, null];
}
