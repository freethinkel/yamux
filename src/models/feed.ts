import type { PlayList } from "./playlist";
import type { Cover } from "./types";

export type GeneratedPlayListItem = {
  data: GeneratedPlayList;
  notify: boolean;
  ready: boolean;
  type: "playlistOfTheDay";
};

export type GeneratedPlayList = PlayList & {
  animatedCoverUri: string;
  coverWithoutText: Cover;
  everPlayed: boolean;
  generatedPlaylistType: string;
  idForFrom: string;
  madeFor: any;
  ogTitle: string;
  playCounter: any;
  uid: number;
  urlPart: string;
};
