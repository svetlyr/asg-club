"use client";
import { Button, toast } from "@payloadcms/ui";
import deployClient from "@/server/deploy-client";

export default function DeployButton() {
    const handleClick = async () => {
        const [response, error] = await deployClient();

        console.log({ response, error });

        if (error) {
            toast.error("Error deploying client");
            return;
        }

        if (response?.status === 204) {
            toast.success("Client deployed successfully");
        }
    };

    return <Button onClick={handleClick}>Deploy Client</Button>;
}
