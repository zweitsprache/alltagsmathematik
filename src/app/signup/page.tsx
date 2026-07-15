"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { authClient } from "@/lib/auth/client";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await authClient.signUp.email({ name, email, password, callbackURL: "/" });
            if (result.error) {
                setError(result.error.message ?? "Account creation failed.");
                return;
            }

            router.replace("/");
            router.refresh();
        } catch (signupError) {
            setError(signupError instanceof Error ? signupError.message : "Account creation failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-dvh bg-primary">
            <section className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-12 sm:px-8">
                <div className="mb-10 flex size-12 items-center justify-center rounded-xl bg-brand-solid">
                    <UntitledLogoMinimal className="size-8 scale-100" />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-display-sm font-semibold text-primary">Create an account</h1>
                    <p className="text-md text-tertiary">Enter your details to get started.</p>
                </div>

                <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Input name="name" label="Name" autoComplete="name" placeholder="Enter your name" size="md" isRequired isDisabled={isLoading} />
                    <Input name="email" label="Email" type="email" autoComplete="email" placeholder="Enter your email" size="md" isRequired isDisabled={isLoading} />
                    <Input name="password" label="Password" type="password" autoComplete="new-password" placeholder="Create a password" size="md" isRequired isDisabled={isLoading} />
                    <Input name="passwordConfirmation" label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat your password" size="md" isRequired isDisabled={isLoading} />

                    {error && <p role="alert" className="text-sm text-error-primary">{error}</p>}

                    <Button type="submit" color="primary" size="md" className="w-full rounded-md" isLoading={isLoading}>
                        Create account
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-tertiary">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}
