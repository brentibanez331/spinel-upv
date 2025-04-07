import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";
import { X } from "lucide-react";
interface Card {
  id: string;
  userId: string;
  imgUrl: string;
  displayName: string;
  politicalParty: string;
}
import { createClient } from "@/utils/supabase/client";

export const SwipeCard = ({
  id,
  userId,
  imgUrl,
  displayName,
  politicalParty,
  cards,
  setCards,
}: {
  id: string;
  userId: string;
  imgUrl: string;
  displayName: string;
  politicalParty: string;
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const likedOpacity = useTransform(x, [0, 100], [0, 1]);
  const disLikedOpacity = useTransform(x, [0, -100], [0, 1]);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);
  const [user, setUser] = useState<any>(null);
  const [swipedCandidateId, setSwipedCandidateId] = useState<string | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(x, "change", (latest) => console.log(latest));

  const handleDragEnd = (id: string) => {
    if (Math.abs(x.get()) > 10) {
      setCards((pv) => pv.filter((prev) => prev.id !== id));
    }
    if (x.get() > 0) {
      // setLikedCandidates((prev) => [...prev, id]);
      // console.log("LIKE CANDIDATES: ", likedCandidates);
      setSwipedCandidateId(id);
      const saveSwipeAction = async () => {
        const supabase = createClient();

        const { data, error } = await supabase.from("ballot").insert([
          {
            user_id: userId,
            candidate_id: id,
          },
        ]);
        console.log("DATA INSERTED");
        if (error) {
          console.error("Error saving swipe action:", error);
        }
      };
      setIsVisible(true);
      saveSwipeAction();
    }
  };

  return (
    <motion.div
      className="text-center absolute"
      style={{ gridRow: 1, gridColumn: 1 }}
    >
      <motion.div
        style={{ opacity: likedOpacity, zIndex: 10 }}
        className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <Check stroke="green" size={48} />
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: disLikedOpacity, zIndex: 20 }}
        className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <X stroke="red" size={48} />
        </div>
      </motion.div>

      <motion.div
        style={{ x, opacity, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={() => handleDragEnd(id)}
        className="relative w-72 h-96"
      >
        <motion.img
          className="object-cover rounded-xl w-full h-full hover:cursor-grab active:cursor-grabbing"
          src={imgUrl}
          alt={`Candidate ${displayName}`}
        />

        <motion.div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent rounded-b-xl" />

        <p className="absolute bottom-12 left-4 text-sm text-white">
          {displayName}
        </p>
        <p className="absolute bottom-8 left-4 text-xs text-white">
          {politicalParty}
        </p>
      </motion.div>
    </motion.div>
  );
};

const SwipeCards = ({ candidates }: { candidates: Card[] }) => {
  const [cards, setCards] = useState<Card[]>(candidates);
  const [likedCandidates, setLikedCandidates] = useState<string[]>([]);
  return (
    <div className="min-h-screen grid place-items-center">
      {cards.length > 0 ? (
        cards.map((card) => (
          <SwipeCard
            userId={card.userId}
            key={card.id}
            cards={cards}
            setCards={setCards}
            id={card.id}
            imgUrl={card.imgUrl}
            displayName={card.displayName}
            politicalParty={card.politicalParty}
          />
        ))
      ) : (
        <div className="text-center p-4">No more candidates to review!</div>
      )}
    </div>
  );
};

export default SwipeCards;