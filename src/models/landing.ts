import type { LandingBlockType, Track, TrackItem } from "./types";
// import type { LandingBlockEntity } from "./blockentity";
// import type { Promotion } from "./promotion";
// import type { ChartItem } from "./chartitem";
// import type { MixLink } from "./mixLink";
// import type { PodcastItem } from "./podcastItem";
import type { GeneratedPlayListItem } from "./feed";
import type { Album } from "./album";
import type { PlayList } from "./playlist";

export type LandingBlock = {
  id: string;
  title: string;
  type:
    | "personal-playlists"
    | "podcasts"
    | "play-context"
    | "chart"
    | "new-playlists"
    | "new-releases"
    | "promotions"
    | string;
  /**
   * Where block was got from
   */
  typeForFrom: LandingBlockType;
  description: string | undefined;
  entities: Array<
    | LandingBlockEntity<
        | Promotion
        | Album
        | PlayList
        | ChartItem
        | MixLink
        | GeneratedPlayListItem
      >
    | PodcastItem
  >;
};

export type LandingBlockEntity<T> = {
  id: string;
  type: LandingBlockType;
  data: T;
};

export type Promotion = {
  promoId: string;
  title: string;
  subtitle: string;
  heading: string;
  urlScheme: string;
  url: string;
  textColor: string;
  gradient: string;
  image: string;
};

export type ChartItem = TrackItem & {
  track: Track;
  chart: Chart;
};

export type Chart = {
  bgColor: string;
  position: number;
  progress: "same" | "up" | "down";
  listeners: number;
  shift: number;
};

export type MixLink = {
  title: string;
  url: string;
  urlScheme: string;
  textColor: string;
  backgroundColor: string;
  backgroundImageUri: string;
  coverWhite: string;
};

export type PodcastItem = {
  type: string;
  podcast: Album;
  description: string;
  descriptionFormatted: string;
  lastUpdated: string;
  data: {
    podcast: Album;
    description: string;
    descriptionFormatted: string;
    lastUpdated: string;
  };
};
