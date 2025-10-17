import { useCallback, useEffect, useRef, useState } from "react";

type CountdownOptions = {
    countStart: number;
    countStop?: number;
    intervalMs?: number;
    isIncrement?: boolean;
};

type CountdownControllers = {
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: () => void;
};

export function useCountdown({
    countStart,
    countStop = 0,
    intervalMs = 1000,
    isIncrement = false,
}: CountdownOptions): [number, CountdownControllers] {
    const [count, setCount] = useState<number>(countStop);
    const [isRunning, setIsRunning] = useState(false);

    const cfg = useRef({ countStop, isIncrement });
    cfg.current = { countStop, isIncrement };

    const stopCountdown = useCallback(() => setIsRunning(false), []);
    const startCountdown = useCallback(() => {
        setCount(countStart);
        setIsRunning(true);
    }, [countStart]);
    const resetCountdown = useCallback(() => {
        setIsRunning(false);
        setCount(countStop);
    }, [countStop]);

    useEffect(() => {
        if (!isRunning) return;
        const id = window.setInterval(() => {
            setCount((c) => {
                const { countStop, isIncrement } = cfg.current;
                const next = isIncrement ? c + 1 : c - 1;

                const done = isIncrement ? next >= countStop : next <= countStop;
                if (done) {
                    setIsRunning(false);
                    return countStop;
                }
                return next;
            });
        }, intervalMs);
        return () => window.clearInterval(id);
    }, [isRunning, intervalMs]);

    return [count, { startCountdown, stopCountdown, resetCountdown }];
}
