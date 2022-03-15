import type { Track } from "./types";

export type Restriction = {
  name: string;
  possibleValues: { value: string; name: string }[];
  type: string;
};

export type Station = {
  adParams: {
    adVolume: number;
    categoryId: string;
    otherParams: string;
    pageRef: string;
    partnerId: string;
    targetRef: string;
  };
  explanation: string;
  rupDescription: string;
  rupTitle: string;
  settings: {
    diversity: string;
    energy: number;
    language: string;
    mood: number;
  };
  settings2: {
    diversity: string;
    language: string;
    moodEnergy: string;
  };
  station: {
    fullImageUrl: string;
    icon: { backgroundColor: string; imageUrl: string };
    id: { type: string; tag: string };
    idForFrom: string;
    mtsIcon: { backgroundColor: string; imageUrl: string };
    name: string;
    restrictions: {
      language: Restriction;
      mood: Restriction;
      energy: Restriction;
      diversity: Restriction;
    };
    restrictions2: {
      diversity: Restriction;
      moodEnergy: Restriction;
      language: Restriction;
    };
  };
};

export type FeedbackParams = {
  type: "radioStarted" | "trackStarted" | "trackFinished" | "skip";
  timestamp: number;
  from: string;
  batchId: string;
  totalPlayedSeconds: number;
  trackId: string | number;
};

export type Sequence = {
  liked: boolean;
  track: Track;
  trackParameters: { bpm: number; hue: number; energy: number };
  type: string;
};
