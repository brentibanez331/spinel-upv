"use client";

import SwipeCards from "@/components/ui/swipe-cards";

export type Card = {
  id: number;
  url: string;
  name: string;
};

export const cardData: Card[] = [
  { id: 1, url: "/candidate-1.jpg", name: "Jane" },
  { id: 2, url: "/candidate-2.jpg", name: "Doe" },
  { id: 3, url: "/candidate-5.jpg", name: "Paulooo" },
  { id: 4, url: "/candidate-4.png", name: "Bob" },
  { id: 5, url: "/candidate-3.jpg", name: "Paulo" },
];

export default function Home() {
  return (
    <>
      {/* <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}

      <SwipeCards />
    </>
  );
}
