"use server";

import tryCatch from "@/utils/tryCatch";
import env from "@env";

type DispatchErr = {
    status?: number;
    message: string;
};

const owner = "svetlyr";
const repo = "asg-club";
const eventType = "deploy-from-cms";
const token = env.GITHUB_CLIENT_DEPLOY_PAT;

export default async function deployClient() {
    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
    };

    const body = JSON.stringify({
        event_type: eventType,
    });

    const [response, error] = await tryCatch(
        fetch(url, {
            cache: "no-store",
            method: "POST",
            headers,
            body,
        }),
    );

    if (error) {
        const err: DispatchErr = {
            message: error instanceof Error ? error.message : "Unknown fetch error",
        };
        return [null, err] as const;
    }

    const requestId = response.headers.get("x-github-request-id");
    const ok = {
        status: response.status,
        requestId,
        eventType,
    };
    return [ok, null] as const;
}
