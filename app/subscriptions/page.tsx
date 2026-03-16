'use client';

import { PricingTable } from "@clerk/nextjs";

import { Check } from "lucide-react";


export default function SubscriptionsPage() {
    return (
        <main className="clerk-subscriptions">
            <div className="max-w-4xl mx-auto space-y-6 text-center mb-16 pt-10">
                <h1 className="page-title text-text-primary font-serif">
                    Premium Learning Plans
                </h1>
                <p className="page-description text-text-secondary max-w-2xl mx-auto font-sans">
                    Unlock higher limits, longer voice sessions, and complete history tracking to transform how you learn from books.
                </p>
            </div>
            
            <div className="max-w-7xl mx-auto pb-20 w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
                
                {/* Clerk Pricing Table for Standard & Pro */}
                <div className="pricing-table-container flex-1 w-full">
                    <PricingTable 
                        appearance={{
                            variables: {
                                colorPrimary: '#0066CC',
                                colorText: '#1D1D1F',
                                colorBackground: '#FFFFFF',
                                borderRadius: '0.75rem',
                            },
                            elements: {
                                card: "shadow-soft-md border-0 transition-transform duration-300 hover:scale-[1.01] bg-white !min-h-[420px]",
                                buttonPrimary: "shadow-soft hover:shadow-soft-md transition-all font-bold rounded-full h-11 bg-accent-blue hover:bg-accent-blue-hover",
                                cardTitle: "font-serif text-2xl mb-4",
                                cardDescription: "text-text-secondary leading-relaxed",
                                featureList: "mt-8 space-y-4",
                                featureItem: "text-text-secondary flex items-start gap-3",
                                featureIcon: "text-accent-blue mt-1 shrink-0",
                            }
                        }}
                    />
                </div>
            </div>

            <style jsx global>{`
                .pricing-table-container {
                    --cl-pricing-table-background: #ffffff;
                    --cl-pricing-table-border-color: var(--border-subtle);
                }
                
                /* Target the current/active plan card - use :has for the non-empty badge or current flag */
                .cl-pricingTableCard:has(.cl-pricingTableCardBadge:not(:empty)),
                .cl-pricingTableCard[data-current="true"],
                .cl-pricingTableCard[data-state="active"],
                .cl-pricingTableCard--current {
                    border: 3px solid #0066CC !important;
                    box-shadow: var(--shadow-soft-lg) !important;
                    transform: scale(1.02);
                    z-index: 10;
                }
                
                /* Ensure non-active cards are clean and have no blue border */
                .cl-pricingTableCard:not(:has(.cl-pricingTableCardBadge:not(:empty))):not([data-current="true"]):not([data-state="active"]):not(.cl-pricingTableCard--current) {
                    border: 1px solid var(--border-subtle) !important;
                    transform: scale(1);
                    box-shadow: var(--shadow-soft-md) !important;
                }

                .cl-pricingTableCardBadge {
                    background-color: #0066CC !important;
                    color: white !important;
                    font-weight: 600 !important;
                    border-radius: 9999px !important;
                    padding: 4px 12px !important;
                }

                @media (max-width: 640px) {
                    .pricing-table-container {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </main>
    );
}


