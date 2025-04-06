import SwipeCardsPage from "./swipecards/page";
import BallotPage from "./ballot/page";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function candidatesLiked() {
  return (
    <div>
      <SwipeCardsPage />
      <BallotPage />
    </div>
  );
}
