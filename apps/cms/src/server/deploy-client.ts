"use server";

import tryCatch from "@/utils/tryCatch";
import env from "@env";
import { revalidatePath } from "next/cache";

type DispatchOk = {
    status: number;
    requestId?: string | null;
    workflowId: string;
    ref: string;
};
type DispatchErr = {
    status?: number;
    message: string;
};

type DeployOpts = {
    ref?: string;
    inputs?: Record<string, string>;
    workflowId?: string;
    pathToRevalidate?: string;
};

const ref = "master";
const owner = "svetlyr";
const repo = "asg-club";
const workflowId = "deploy-client.yml";
const token = env.GITHUB_CLIENT_DEPLOY_PAT;

export default async function deployClient(opts: DeployOpts = {}) {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(
        workflowId,
    )}/dispatches`;

    const headers: HeadersInit = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        // "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    };

    const body = JSON.stringify({ ref });

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
        return [null, err];
    }

    if (response.status === 204) {
        const requestId = response.headers.get("x-github-request-id");
        revalidatePath(opts.pathToRevalidate || "/");
        const ok: DispatchOk = { status: 204, requestId, workflowId, ref };
        return [ok, null];
    }

    return [null, error];
}
