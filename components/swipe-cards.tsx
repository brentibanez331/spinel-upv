import React, { Dispatch, SetStateAction, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart } from "lucide-react";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";



interface Card {
  id: string;
  userId: string;
  imgUrl: string;
  displayName: string;
  politicalParty: string;
}

type CardRef = {
  animateSwipe: (direction: 'left' | 'right') => void;
};

export const SwipeCard = ({
  id,
  userId,
  imgUrl,
  displayName,
  politicalParty,
  cards,
  setCards,
  onSwipe,
  cardRef
}: {
  id: string;
  userId: string;
  imgUrl: string;
  displayName: string;
  politicalParty: string;
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
  onSwipe: (direction: 'left' | 'right', id: string) => void
  cardRef?: React.RefObject<CardRef | null> | null;
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const likedOpacity = useTransform(x, [0, 100], [0, 1]);
  const disLikedOpacity = useTransform(x, [0, -100], [0, 1]);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);

  const handleDragEnd = (event: any) => {
    if (Math.abs(x.get()) > 100) {
      const direction = x.get() > 0 ? 'right' : 'left';
      setTimeout(() => {
        onSwipe(direction, id);
      }, 300);
      // onSwipe(direction, id); // Call onSwipe callback
    } else {
      animate(x, 0, { type: "spring", damping: 15 }); // Return to center
    }
  };

  const animateSwipe = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? 200 : -200;

    // Animate the card
    animate(x, targetX, {
      type: "spring",
      duration: 0.5,
      onComplete: () => {
        setTimeout(() => {
          onSwipe(direction, id);
        }, 100);
      }
    });
  };

  useImperativeHandle(cardRef, () => ({
    animateSwipe
  }), [animateSwipe]);

  // const handleDragEnd = (id: string) => {
  //   if (Math.abs(x.get()) > 10) {
  //     setCards((pv) => pv.filter((prev) => prev.id !== id));
  //   }

  //   if (x.get() > 0) {
  //     setSwipedCandidateId(id);
  //     const saveSwipeAction = async () => {
  //       const { data, error } = await supabase.from("ballot").insert([
  //         {
  //           user_id: userId,
  //           candidate_id: id,
  //           status: "saved"
  //         },
  //       ]);

  //       if (error) {
  //         console.error("Error saving swipe action:", error);
  //       }
  //     };
  //     setIsVisible(true);
  //     saveSwipeAction();
  //   } else {
  //     setSwipedCandidateId(id);
  //     const saveSwipeAction = async () => {
  //       const { data, error } = await supabase.from('ballot').insert([
  //         {
  //           user_id: userId,
  //           candidate_id: id,
  //           status: "hidden"
  //         }
  //       ])

  //       if (error) {
  //         console.error("Error saving swipe action:", error);
  //       }
  //     }

  //     setIsVisible(true);
  //     saveSwipeAction()
  //   }
  // };


  return (
    <div className="flex flex-col absolute items-center">
      <motion.div
        className="text-center hover:cursor-grab active:cursor-grabbing"
        style={{ gridRow: 1, gridColumn: 1, zIndex: cards.length - cards.findIndex(card => card.id === id) }}
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
          className="relative w-[300px] h-[400px]"
        >
          <motion.img
            className="object-cover rounded-xl w-full h-full "
            src={imgUrl}
            alt={`Candidate ${displayName}`}
          />

          <motion.div className="absolute bottom-0 left-0 w-full h-full rounded-b-xl" />

          <div className="absolute left-0 z-10 rounded-b-xl bottom-0 find w-full h-[100px] bg-gradient-to-t from-neutral-900 from-10% to-transparent ">
          </div>
          <div className="absolute text-left z-20 bottom-8 left-4 text-white">
            <p className="text-normal font-bold">{displayName}</p>
            <p className="text-xs text-neutral-300">{politicalParty}</p>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};



const SwipeCards = ({ candidates }: { candidates: Card[] }) => {
  const [cards, setCards] = useState<Card[]>(candidates);
  const [likedCandidates, setLikedCandidates] = useState<{ candidate: Card, status: string }[]>([]);
  const supabase = createClient()

  const topCardRef = useRef<CardRef>(null);

  const handleSwipe = async (direction: 'left' | 'right', candidateId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== candidateId));

    const status = direction === 'right' ? 'saved' : 'hidden';

    try {
      const { error } = await supabase.from("ballot").insert([
        {
          user_id: candidates.find(c => c.id === candidateId)?.userId || '', // Ensure userId is available
          candidate_id: candidateId,
          status,
        },
      ]);

      if (error) {
        console.error("Error saving swipe action:", error);
      }

      addToLikedCandidates(candidates.find(c => c.id === candidateId)!, status)
    } catch (error) {
      console.error("Error saving swipe action:", error);
    }
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    if (topCardRef.current && cards.length > 0) {
      topCardRef.current.animateSwipe(direction);
    }
  };

  const addToLikedCandidates = (candidate: Card, status: string) => {
    likedCandidates.push({ candidate: candidate, status: "" })
  }


  return (
    <div className="min-h-screen flex pt-10 pl-48">
      <div>
        {cards.length > 0 ? (
          <div>
            {cards.map((card, index) => (
              <SwipeCard
                userId={card.userId}
                key={card.id}
                cards={cards}
                setCards={setCards}
                id={card.id}
                imgUrl={card.imgUrl}
                displayName={card.displayName}
                politicalParty={card.politicalParty}
                onSwipe={handleSwipe}
                cardRef={index === 0 ? topCardRef : null}
              />
            ))}

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 space-x-4 sm:pr-96">
              <Button onClick={() => handleButtonClick('left')} className="rounded-full" variant={"outline"} size={"icon"}><X className="text-red-500" /></Button>
              <Button onClick={() => handleButtonClick('right')} className="rounded-full" variant={"outline"} size={"icon"}><Heart className="text-[#3f4ea2]" /></Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">No more candidates to review!</div>
        )}
      </div >
      <div>
        {likedCandidates.length > 0 ? (
          <>
            {likedCandidates.map((liked, index) => (
              <div key={index}>{liked.candidate.displayName}</div>
            ))}
          </>

        ) : (
          <p>No candidates liked</p>
        )}
      </div>
    </div>
  );
};

export default SwipeCards;