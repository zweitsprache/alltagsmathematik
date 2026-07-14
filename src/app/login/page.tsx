"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";

export default function LoginPage() {
    return (
        <main className="flex min-h-dvh bg-primary">
            <section className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-12 sm:px-8">
                <div className="mb-10 flex size-12 items-center justify-center rounded-xl bg-brand-solid">
                    <UntitledLogoMinimal className="size-8 scale-100" />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-display-sm font-semibold text-primary">Log in to your account</h1>
                    <p className="text-md text-tertiary">Welcome back! Please enter your details.</p>
                </div>

                <form className="mt-8 flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
                    <Input label="Email" type="email" placeholder="Enter your email" size="md" isRequired />
                    <Input label="Password" type="password" placeholder="Enter your password" size="md" isRequired />

                    <div className="flex items-center justify-between gap-4">
                        <Checkbox label="Remember for 30 days" />
                        <Link href="#" className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                            Forgot password
                        </Link>
                    </div>

                    <Button type="submit" color="primary" size="md" className="w-full rounded-md">
                        Sign in
                    </Button>
                    <button type="button" className="inline-flex items-center justify-center gap-3 rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset transition hover:bg-primary_hover">
                        <span className="text-lg font-bold text-[#4285f4]">G</span>
                        Sign in with Google
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-tertiary">
                    Don&apos;t have an account?{" "}
                    <Link href="#" className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                        Sign up
                    </Link>
                </p>
            </section>
        </main>
    );
}
