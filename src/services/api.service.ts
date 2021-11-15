import axios from "axios";
import { http } from "@tauri-apps/api";
import { derived } from "../../node_modules/svelte/store";
import { API_URL } from "../config";
import type { PlayList } from "../models/playlist";
import type { YandexMusicResponse } from "../models/yandex";
import { getUserId, isAutorized } from "../store/auth";
import type {
  DownloadInfo,
  GetTracksResponse,
  LikedTracksResponse,
  TrackDownloadInfo,
  TrackItem,
} from "../models/types";
import type { GeneratedPlayList } from "../models/feed";
import crypto from "crypto-js";

export const httpClient = axios.create();

const getClient = (): Promise<http.Client> =>
  new (window as any).__TAURI__.http.getClient().then((c) => {
    return new (window as any).__TAURI__.http.Client(c.id);
  });

const headers = {};

export const httpRust = {
  setHeaders(h: Record<string, string>) {
    Object.entries(h).forEach(([key, value]) => {
      headers[key] = value;
    });
  },
  get: <T extends any>(
    url: string
  ): Promise<{
    data: T;
  }> => {
    return getClient().then((client) => client.get(url, { headers: headers }));
  },
  post: <T extends any>(
    url: string,
    body?: http.Body,
    config?: Partial<http.HttpOptions>
  ): Promise<{
    data: T;
  }> => {
    return getClient().then((client) =>
      client.post(url, body, {
        headers: { ...((config || {}).headers || {}), ...headers },
        ...(config || {}),
      })
    );
  },
};

export class ApiService {
  static auth(login: string, password: string) {
    const sp = new URLSearchParams();
    Object.entries({
      grant_type: "password",
      client_id: "23cabbbdc6cd418abb4b39c32c41195d",
      client_secret: "53bc75238f0c4d08a118e51fe9203300",
      username: login,
      password: password,
    }).forEach(([key, value]) => {
      sp.append(key, value);
    });
    return httpClient.post("https://oauth.yandex.ru/token", sp.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }

  static getUsersPlaylists() {
    return httpRust.get<YandexMusicResponse<PlayList[]>>(
      `${API_URL}/users/${getUserId()}/playlists/list`
    );
  }

  static getPlaylistInfo(kind: number) {
    return httpRust.get<YandexMusicResponse<GeneratedPlayList>>(
      `${API_URL}/users/${getUserId()}/playlists/${kind}`
    );
  }

  static async getTrackUrl(id: string): Promise<string> {
    const downloadInfo = await ApiService.getDownloadInfo(id);
    const url = await this.createTrackURL(downloadInfo);
    return url;
  }

  static async getDownloadInfo(trackId: string): Promise<DownloadInfo> {
    const result = (
      await httpRust.get<YandexMusicResponse<TrackDownloadInfo[]>>(
        `${API_URL}/tracks/${trackId}/download-info`
      )
    ).data.result;

    const info = isAutorized()
      ? result.find((item) => item.codec === "mp3" && !item.preview)
      : result[0];

    const downloadInfo = await httpRust.get<DownloadInfo>(
      `${info!.downloadInfoUrl}&format=json`
    );

    return downloadInfo.data;
  }

  static async createTrackURL(info: DownloadInfo) {
    const trackUrl = `XGRlBW9FXlekgbPrRHuSiA${info["path"].substr(1)}${
      info["s"]
    }`;

    const hashedUrl = crypto.MD5(trackUrl).toString(crypto.enc.Hex);

    const link = `https://${info.host}/get-mp3/${hashedUrl}/${info.ts}${info.path}`;

    return link;
  }

  static async getTracks(
    trackIds: string[],
    withPositions?: boolean
  ): Promise<GetTracksResponse> {
    try {
      const sp = new URLSearchParams();
      Object.entries({
        "track-ids": trackIds.join(","),
        "with-positions": withPositions || false,
      }).forEach(([key, value]) => {
        sp.append(key, value.toString());
      });

      const tracks = await httpRust.post<GetTracksResponse>(
        `${API_URL}/tracks/`,
        http.Body.text(sp.toString()),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return tracks.data;
    } catch (error) {
      return error;
    }
  }

  static async getLikedTracks() {
    const trackIds = await httpRust.get<LikedTracksResponse>(
      `${API_URL}/users/${getUserId()}/likes/tracks`
    );
    const tracks = await this.getTracks(
      trackIds.data.result.library.tracks.map((t) => t.id)
    );

    return tracks;
  }
}
