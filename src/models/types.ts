import type { LandingBlock } from "./landing";
import type { GeneratedPlayListItem } from "./feed";
import type { Album } from "./album";
import type { PlayList } from "./playlist";

export type GetPlayListsOptions = {
  mixed?: boolean;
  "rich-tracks"?: boolean;
};

export type InitResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
  uid: number;
};

export type FeedResponse = {
  canGetMoreEvents: boolean;
  days: any[];
  generatedPlaylists: GeneratedPlayListItem[];
  headlines: any[];
  isWizardPassed: boolean;
  pumpkin: boolean;
  today: string;
};

export type LandingResult = {
  pumpkin: boolean;
  contentId: string;
  blocks: LandingBlock[];
};

export type LandingResponse = YandexMusicResponse<LandingResult>;

export type Visibility = "public" | "private";

export type TrackItem = {
  id: number;
  playCount: number;
  recent: boolean;
  timestamp: string;
  /**
   * Null when tracks are not riched
   */
  track?: Track;
};

export type Artist = {
  composer: boolean;
  cover?: Cover;
  decomposed?: any[];
  genres: any[];
  // TODO: when use "yandexApi.search" id is "number", but when use "yandexApi.getPopularTracks" it is "string"
  id: string | number;
  name: string;
  various: boolean;
  popularTracks?: Track[];
  /**
   * Имеются ли в продаже билеты на концерт
   */
  ticketsAvailable?: boolean;
  regions?: string[];
};

export type Track = {
  albums: Album[];
  artists: Artist[];
  available: boolean;
  availableForPremiumUsers: boolean;
  availableFullWithoutPermission: boolean;
  /**
   * Cover uri template. To get cover uri with specified size use "getCoverUri" method
   */
  coverUri: string;
  durationMs: number;
  fileSize: number;
  id: string;
  lyricsAvailable: boolean;
  major: {
    id: number;
    name: string;
  };
  normalization: {
    gain: number;
    peak: number;
  };
  ogImage: string;
  previewDurationMs: number;
  realId: string;
  rememberPosition: boolean;
  storageDir: string;
  title: string;
  type: string; //music
};

export type Cover = {
  custom: boolean;
  /**
   * Exists when @field type = "pic"
   */
  dir?: string;
  type: "pic" | "mosaic";
  /**
   * Exists when @field type = "mosaic"
   */
  itemsUri?: string[];
  /**
   * Exists when @field type = "pic"
   */
  uri?: string;
  version?: string;
};

export type Owner = {
  login: string;
  name: string;
  sex: string;
  uid: number;
  verified: boolean;
};

export type TrackDownloadInfo = {
  bitrateInKbps: number;
  codec: "mp3" | "aac";
  gain: boolean;
  preview: boolean;
  downloadInfoUrl: string;
};

export type DownloadInfo = {
  s: string;
  ts: string;
  path: string;
  host: string;
};

export type InvocationInfo = {
  hostname: string;
  "req-id": string;
  "exec-duration-mills": string;
};

export type LikedTrack = {
  id: string;
  albumId: string;
  timespan: string;
};

export type LikedTracksResponse = YandexMusicResponse<{
  library: {
    uid: number;
    revision: number;
    tracks: LikedTrack[];
  };
}>;

export type GetTracksResponse = YandexMusicResponse<Track[]>;

export type YandexMusicResponse<T> = {
  invocationInfo: InvocationInfo;
  result: T;
};

export type LandingBlockType =
  | "personalplaylists"
  | "promotions"
  | "new-releases"
  | "new-playlists"
  | "mixes"
  | "chart"
  | "artists"
  | "albums"
  | "playlists"
  | "play_contexts"
  | "podcasts";

export const ALL_LANDING_BLOCKS: LandingBlockType[] = [
  "personalplaylists",
  "promotions",
  "new-releases",
  "new-playlists",
  "mixes",
  "chart",
  "artists",
  "albums",
  "playlists",
  "play_contexts",
  "podcasts",
];

export type ISearchOptions = {
  type?: "artist" | "album" | "track" | "podcast" | "all";
  page?: number;
  nococrrect?: boolean;
};

export type SearchResponse = YandexMusicResponse<SearchResult>;

export type SearchResult = {
  misspellCorrected: boolean;
  nocorrect: boolean;
  searchRequestId: string;
  text: string;
  /**
   * The best result
   */
  best: any;
  videos: any;
  tracks: SearchTypeResult<Track>;
  playlists: SearchTypeResult<PlayList>;
  albums: SearchTypeResult<Album>;
  artists: SearchTypeResult<Artist>;
  podcasts: SearchTypeResult<any>;
};

/**
 * Represents search result for tracks, playlists, albums, ...
 */
export type SearchTypeResult<T> = {
  /**
   * Results count
   */
  total: number;
  /**
   * Maximum results count on the page
   */
  perPage: number;
  /**
   * Block position
   */
  order: number;
  /**
   * Search results
   */
  results: T[];
};

export type ArtistPopularTracksResponce = YandexMusicResponse<{
  artist: Artist;
  tracks: string[];
}>;
