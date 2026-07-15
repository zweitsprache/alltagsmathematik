"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronSelectorVertical } from "@untitledui/icons";
import { Button as AriaButton, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { authClient } from "@/lib/auth/client";
import { cx } from "@/utils/cx";
import { NavAccountMenu, type NavAccountType } from "./nav-account-card";

export const AuthNavAccountCard = () => {
    const router = useRouter();
    const triggerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useBreakpoint("lg");
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <div className="h-[70px] animate-pulse rounded-xl bg-secondary ring-1 ring-secondary ring-inset" aria-label="Loading account" />;
    }

    if (!session?.user) {
        return (
            <Link href="/login" className="flex items-center justify-center rounded-xl p-3 text-sm font-semibold text-brand-secondary ring-1 ring-secondary ring-inset outline-focus-ring hover:bg-primary_hover focus-visible:outline-2">
                Sign in
            </Link>
        );
    }

    const signOut = async () => {
        await authClient.signOut();
        router.replace("/login");
        router.refresh();
    };

    const account: NavAccountType = {
        id: session.user.id,
        name: session.user.name || session.user.email,
        email: session.user.email,
        avatar: session.user.image ?? "",
        status: "online",
    };

    return (
        <div ref={triggerRef} className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset">
            <AvatarLabelGroup
                className="min-w-0"
                size="md"
                src={account.avatar}
                title={account.name}
                subtitle={account.email}
                status="online"
            />

            <AriaDialogTrigger>
                <AriaButton className="absolute top-2 right-2 flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 pressed:bg-primary_hover">
                    <ChevronSelectorVertical className="size-4 shrink-0 stroke-[2.25px]" />
                </AriaButton>
                <AriaPopover
                    placement={isDesktop ? "right bottom" : "top right"}
                    triggerRef={triggerRef}
                    offset={8}
                    className={({ isEntering, isExiting }) =>
                        cx(
                            "origin-(--trigger-anchor-point) will-change-transform",
                            isEntering && "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5",
                            isExiting && "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5",
                        )
                    }
                >
                    <NavAccountMenu selectedAccountId={account.id} accounts={[account]} onSignOut={signOut} />
                </AriaPopover>
            </AriaDialogTrigger>
        </div>
    );
};
