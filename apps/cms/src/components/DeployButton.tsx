"use client";
import { Button, LoadingOverlay, toast } from "@payloadcms/ui";
import { useState } from "react";

import deployClient from "@/server/deploy-client";
import { useCountdown } from "@utils/useCountdown";

export default function DeployButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, { startCountdown }] = useCountdown({
        countStart: 10,
        countStop: 0,
        intervalMs: 1000,
    });

    const runDeploy = async () => {
        setIsLoading(true);
        const [response, error] = await deployClient();
        setIsLoading(false);

        if (error) return toast.error(error?.message ?? "Error deploying client");
        if (response.status === 204) return toast.success("Client deployed successfully");

        toast.error(`Client deployment failed with code: ${response.status}`);
    };

    const handleClick = () => {
        if (isDisabled) return;

        startCountdown();
        void runDeploy();
    };

    const isDisabled = isLoading || countdown > 0;
    return (
        <>
            <LoadingOverlay show={isLoading} />
            <Button onClick={handleClick} disabled={isDisabled} size="medium">
                {countdown > 0 ? `${countdown}s` : "Deploy Client"}
            </Button>
        </>
    );
}
