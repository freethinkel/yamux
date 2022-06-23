import axios from 'axios';
import { http } from '@tauri-apps/api';
import { API_URL } from '../config';
import type { PlayList } from '../models/playlist';
import type { YandexMusicResponse } from '../models/yandex';
import { getUserId, isAutorized } from '../store/auth';
import type {
	ArtistInfo,
	DownloadInfo,
	GetTracksResponse,
	ISearchOptions,
	LandingBlockType,
	LandingResponse,
	LikedTracksResponse,
	Lyrics,
	SearchResponse,
	Track,
	TrackDownloadInfo,
} from '../models/types';
import { ALL_LANDING_BLOCKS } from '../models/types';
import type { GeneratedPlayList } from '../models/feed';
import crypto from 'crypto-js';
import { querystring } from '../helpers';
import type { FeedbackParams, Sequence, Station } from '../models/station';

export const httpClient = axios.create();

const getClient = http.getClient;

const headers = {};

export const httpRust = {
	setHeaders(h: Record<string, string>) {
		Object.entries(h).forEach(([key, value]) => {
			headers[key] = value;
		});
	},
	get: async <T extends any>(
		url: string,
		config?: Partial<http.HttpOptions>
	): Promise<{
		data: T;
	}> => {
		const client = await getClient();
		return await client.get(url, {
			...(config || {}),
			headers: { ...((config || {}).headers || {}), ...headers },
		});
	},
	post: async <T extends any>(
		url: string,
		body?: http.Body,
		config?: Partial<http.HttpOptions>
	): Promise<{
		data: T;
	}> => {
		const client = await getClient();
		return await client.post(url, body, {
			...(config || {}),
			headers: { ...((config || {}).headers || {}), ...headers },
		});
	},
};

export class ApiService {
	static auth(login: string, password: string) {
		const sp = new URLSearchParams();
		Object.entries({
			grant_type: 'password',
			client_id: '23cabbbdc6cd418abb4b39c32c41195d',
			client_secret: '53bc75238f0c4d08a118e51fe9203300',
			username: login,
			password: password,
		}).forEach(([key, value]) => {
			sp.append(key, value);
		});
		return httpClient.post('https://oauth.yandex.ru/token', sp.toString(), {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		});
	}

	static getUsersPlaylists() {
		return httpRust.get<YandexMusicResponse<PlayList[]>>(
			`${API_URL}/users/${getUserId()}/playlists/list`
		);
	}

	static renamePlaylist(kind: number, name: string) {
		return httpRust.post<YandexMusicResponse<never>>(
			`${API_URL}/users/${getUserId()}/playlists/${kind}/name`,
			http.Body.text(querystring({ value: name })),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
	}

	static removePlaylist(kind: number) {
		return httpRust.post<YandexMusicResponse<never>>(
			`${API_URL}/users/${getUserId()}/playlists/${kind}/delete`
		);
	}

	static createPlaylist(
		name: string,
		visibility: 'public' | 'private' = 'public'
	) {
		return httpRust.post<YandexMusicResponse<PlayList>>(
			`${API_URL}/users/${getUserId()}/playlists/create`,
			http.Body.text(querystring({ title: name, visibility })),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
	}

	static addTrackToPlaylist(
		kind: number,
		revision: number,
		tracks: { id: string; albumId: string }[]
	) {
		return httpRust.post<YandexMusicResponse<PlayList>>(
			`${API_URL}/users/${getUserId()}/playlists/${kind}/change-relative`,
			http.Body.text(
				querystring({
					diff: JSON.stringify([
						{
							op: 'insert',
							at: 0,
							tracks: tracks,
						},
					]),
					revision: revision,
				})
			),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
	}

	static removeTrackFromPlaylist(
		kind: number,
		revision: number,
		tracks: { id: string; albumId: string }[],
		options?: { from?: number; to?: number }
	) {
		return httpRust.post<YandexMusicResponse<PlayList>>(
			`${API_URL}/users/${getUserId()}/playlists/${kind}/change-relative`,
			http.Body.text(
				querystring({
					diff: JSON.stringify([
						{
							op: 'delete',
							from: options?.from ?? 0,
							to: options?.to ?? tracks.length,
							tracks: tracks,
						},
					]),
					revision: revision,
				})
			),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
	}

	static getPlaylistInfo(kind: number, params?: { userId: number | string }) {
		return httpRust.get<YandexMusicResponse<GeneratedPlayList>>(
			`${API_URL}/users/${params?.userId ?? getUserId()}/playlists/${kind}`
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
			? result.find((item) => item.codec === 'mp3' && !item.preview)
			: result[0];

		const downloadInfo = await httpRust.get<DownloadInfo>(
			`${info!.downloadInfoUrl}&format=json`
		);

		return downloadInfo.data;
	}

	static async createTrackURL(info: DownloadInfo) {
		const trackUrl = `XGRlBW9FXlekgbPrRHuSiA${info['path'].substring(1)}${
			info['s']
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
			const tracks = await httpRust.post<GetTracksResponse>(
				`${API_URL}/tracks/`,
				http.Body.text(
					querystring({
						'track-ids': trackIds.join(','),
						'with-positions': withPositions || false,
					})
				),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);

			return tracks.data;
		} catch (error) {
			return error;
		}
	}

	static getLyrics(trackId: string | number) {
		return httpRust.get<YandexMusicResponse<{ id: number; lyrics?: Lyrics }>>(
			`${API_URL}/tracks/${trackId}/supplement`
		);
	}

	static async getAlbumTracks(id: number) {
		return httpRust.get<YandexMusicResponse<any>>(
			`${API_URL}/albums/${id}/with-tracks`
		);
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

	static async search(query: string, options?: ISearchOptions) {
		const opts = options || {};

		return httpRust.get<SearchResponse>(`${API_URL}/search`, {
			query: {
				type: opts?.type ?? 'all',
				text: query,
				page: (opts.page ?? 0).toString(),
				nococrrect: (opts.nococrrect ?? false).toString(),
			},
		});
	}
	static getLanding(...blocks: LandingBlockType[]) {
		return httpRust.get<LandingResponse>(
			`${API_URL}/landing3?blocks=${blocks.join(',')}`
		);
	}

	static async getHomeData() {
		return this.getLanding(...ALL_LANDING_BLOCKS);
	}

	static async getArtist(id: string | number) {
		return httpRust.get<YandexMusicResponse<ArtistInfo>>(
			`${API_URL}/artists/${id}/brief-info`
		);
	}

	static getArtistTracks = (id: string | number) => {
		return httpRust.get<YandexMusicResponse<{ tracks: Track[] }>>(
			`${API_URL}/artists/${id}/tracks`,
			{ query: { 'page-size': '200' } }
		);
	};

	static getStations() {
		return httpRust.get<{ result: { stations: Station[] } }>(
			`${API_URL}/rotor/stations/dashboard`
		);
	}

	static getStationTracks(station: string, query?: { queueTrackId: string }) {
		const params: Record<string, string> = {
			settings2: 'true',
		};
		if (query.queueTrackId) {
			params.queue = query.queueTrackId;
		}
		return httpRust.get<{ result: { sequence: Sequence[]; batchId: string } }>(
			`${API_URL}/rotor/station/${station}/tracks?${querystring(params)}`
		);
	}

	static sendStationFeedback(station: string, params: Partial<FeedbackParams>) {
		const data: Record<string, any> = {
			type: params.type,
			'batch-id': params.batchId,
			timestamp: params.timestamp ?? Date.now(),
			from: 'desktop_win-home-playlist_of_the_day-playlist-default',
		};

		if (params.trackId) {
			data.trackId = params.trackId;
		}

		if (params.totalPlayedSeconds) {
			data.totalPlayedSeconds = params.totalPlayedSeconds;
		}

		return httpRust.post(
			`${API_URL}/rotor/station/${station}/feedback`,
			http.Body.json(data)
		);
	}

	static sendStationFeedbackRadioStarted(
		station: string,
		{ batchId }: { batchId: string }
	) {
		return ApiService.sendStationFeedback(station, {
			type: 'radioStarted',
			batchId,
		});
	}

	static sendStationFeedbackSkip(
		station: string,
		{
			trackId,
			totalPlayedSeconds,
			batchId,
		}: {
			trackId: string | number;
			totalPlayedSeconds: number;
			batchId: string;
		}
	) {
		return ApiService.sendStationFeedback(station, {
			type: 'skip',
			trackId,
			totalPlayedSeconds,
			batchId,
		});
	}

	static sendStationFeedbackTrackStarted(
		station: string,
		{ trackId, batchId }: { trackId: string | number; batchId: string }
	) {
		return ApiService.sendStationFeedback(station, {
			type: 'trackStarted',
			trackId,
			batchId,
		});
	}

	static sendStationFeedbackTrackFinished(
		station: string,
		{ trackId, batchId }: { trackId: string | number; batchId: string }
	) {
		return ApiService.sendStationFeedback(station, {
			type: 'trackFinished',
			trackId,
			batchId,
		});
	}

	static async likeAction(
		objectType: 'track' | 'artist' | 'playlist' | 'album',
		ids: number | string | number[] | string[],
		remove = false
	): Promise<any> {
		const action = remove ? 'remove' : 'add-multiple';
		const result = await httpRust.post<GetTracksResponse>(
			`${API_URL}/users/${getUserId()}/likes/${objectType}s/${action}`,
			http.Body.text(
				querystring({
					[`${objectType}-ids`]: Array.isArray(ids) ? ids.join(',') : ids,
				})
			),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		return result;
	}
}
