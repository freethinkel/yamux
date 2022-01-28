import type { Artist, LandingBlockType, Track, TrackItem } from "./types";
// import type { LandingBlockEntity } from "./blockentity";
// import type { Promotion } from "./promotion";
// import type { ChartItem } from "./chartitem";
// import type { MixLink } from "./mixLink";
// import type { PodcastItem } from "./podcastItem";
import type { GeneratedPlayListItem } from "./feed";
import type { Album } from "./album";
import type { PlayList } from "./playlist";

type LandingBlockBase<T, E> = {
  id: string;
  title: string;
  type: T;
  /**
   * Where block was got from
   */
  typeForFrom: LandingBlockType;
  description: string | undefined;
  entities: E[];
};

// | "personal-playlists"
//     | "podcasts"
//     | "play-context"
//     | "chart"
//     | "new-playlists"
//     | "new-releases"
//     | "promotions"
//     | string;

// entities: Array<
//     | LandingBlockEntity<
//         | Promotion
//         | Album
//         | PlayList
//         | ChartItem
//         | MixLink
//         | GeneratedPlayListItem
//       >
//     | PodcastItem
//   >;

type PlayContext<T, P> = {
  client: "web";
  context: T;
  contextItem: number;
  payload: P;
};

export type LandingBlock =
  | LandingBlockBase<"podcasts", PodcastItem>
  | LandingBlockBase<"chart", LandingBlockEntity<ChartItem>>
  | LandingBlockBase<"new-releases", LandingBlockEntity<Album>>
  | LandingBlockBase<"promotions", LandingBlockEntity<Promotion>>
  | LandingBlockBase<"new-playlists", LandingBlockEntity<PlayList>>
  | LandingBlockBase<"mixes", LandingBlockEntity<MixLink>>
  | LandingBlockBase<
      "play-contexts",
      LandingBlockEntity<
        | PlayContext<"artist", Artist>
        | PlayContext<"playlist", PlayList>
        | PlayContext<"album", Album>
      >
    >
  | LandingBlockBase<
      "personal-playlists",
      LandingBlockEntity<GeneratedPlayListItem>
    >;

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
