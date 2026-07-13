import type { FC, ReactNode } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

/**
 * Untitled UI–style page header: an optional featured icon, a title and
 * supporting text on the left, optional actions on the right, with a divider.
 */
export const PageHeader = ({
    title,
    description,
    icon: Icon,
    actions,
    hierarchicalNumber,
}: {
    title: ReactNode;
    description?: string;
    icon?: FC<{ className?: string }>;
    actions?: ReactNode;
    hierarchicalNumber?: string;
}) => {
    return (
        <div className="flex flex-col gap-4 border-b border-secondary pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    {Icon && <FeaturedIcon icon={Icon} size="lg" color="brand" theme="light" />}
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-baseline gap-4">
                            {hierarchicalNumber && <span className="text-display-xs font-black text-tertiary">{hierarchicalNumber}</span>}
                            <h1 className="text-display-xs font-normal text-primary">{title}</h1>
                        </div>
                        {description && <p className="text-sm text-tertiary">{description}</p>}
                    </div>
                </div>

                {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
            </div>
        </div>
    );
};
