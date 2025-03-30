import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { type Card, cardData } from "@/app/test/page";

const Card = ({
  id,
  url,
  name,
  cards,
  setCards,
}: {
  id: number;
  url: string;
  name: string;
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 50) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
  };
  useMotionValueEvent(x, "change", (latest) => console.log(latest)); //use for debugging stuff

  return (
    <motion.div
      style={{ gridRow: 1, gridColumn: 1, x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="relative w-72 h-96"
    >
      <motion.img
        className="object-cover rounded-xl w-full h-full hover:cursor-grab active:cursor-grabbing"
        src={url}
        alt="Candidate"
      />

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent rounded-b-xl" />

      <p className="absolute bottom-4 left-4 text-white font-semibold">
        {name}
      </p>
    </motion.div>
  );
};

const SwipeCards = () => {
  const [cards, setCards] = useState<Card[]>(cardData);
  return (
    <div className="min-h-screen grid place-items-center">
      {cards.map((card) => {
        return (
          <Card key={card.id} cards={cards} setCards={setCards} {...card} />
        );
      })}
    </div>
  );
};

export default SwipeCards;
