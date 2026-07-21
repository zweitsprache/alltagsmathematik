"use client";

import { Player } from "@remotion/player";

import { HalbtaxAbo } from "../../../../public/remotion/halbtaxt2/halbtax/Root";

const FPS = 30;
const DURATION_IN_FRAMES = 2388;

export default function HalbtaxRemotionTestPage() {
    return (
        <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-5">
                <div>
                    <p className="text-sm font-semibold text-gray-400">Remotion test player</p>
                    <h1 className="mt-1 text-2xl font-semibold">HalbtaxAbo</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Browser preview only — no video rendering or Lambda call.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl">
                    <Player
                        component={HalbtaxAbo}
                        durationInFrames={DURATION_IN_FRAMES}
                        compositionWidth={1080}
                        compositionHeight={1080}
                        fps={FPS}
                        controls
                        clickToPlay
                        doubleClickToFullscreen
                        spaceKeyToPlayOrPause
                        moveToBeginningWhenEnded
                        style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
