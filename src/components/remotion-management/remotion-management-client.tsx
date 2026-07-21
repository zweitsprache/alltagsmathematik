"use client";

import dynamic from "next/dynamic";

const RemotionManagement = dynamic(
    () => import("./remotion-management").then((module) => module.RemotionManagement),
    { ssr: false },
);

export const RemotionManagementClient = () => <RemotionManagement />;
