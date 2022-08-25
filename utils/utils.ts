import type { ShortUrl } from '@prisma/client'
import dayjs from 'dayjs'
import { customAlphabet } from 'nanoid'
import { EMOJI } from './emoji'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
const emojiid = (size: number) =>
	Array(size)
		.fill(0)
		.map(() => EMOJI[Math.floor(Math.random() * EMOJI.length)])
		.join('')

export const delay = (delay: number) => new Promise(r => setTimeout(r, delay))

export const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		return ''
	}
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`
	}

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' })
const relativeTimeFormatter = new Intl.RelativeTimeFormat('en')

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' },
]

export const formatDate = (date: Date) => dateTimeFormatter.format(date)

export const formatDateRelative = (date: Date) => {
	let duration = (date.getTime() - new Date().getTime()) / 1000

	for (let i = 0; i <= DIVISIONS.length; i++) {
		const division = DIVISIONS[i]
		if (Math.abs(duration) < division.amount) {
			return relativeTimeFormatter.format(Math.round(duration), division.name)
		}
		duration /= division.amount
	}
}

export const mergeDateTime = (date: Date | null, time: Date | null) =>
	date && time
		? new Date(date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()))
		: date

export const isValidUrl = (url: string) => {
	try {
		new URL(url)
	} catch {
		return false
	}
	return true
}

export const randomAlias = (emoji = false, size?: number) =>
	(emoji ? emojiid : nanoid)(size ?? (emoji ? 3 : 8))

export const expired = <T extends Pick<ShortUrl, 'expires'>>({ expires }: T) => dayjs().isBefore(expires)

export const transformShurls = <T extends Pick<ShortUrl, 'password' | 'expires' | 'userId'>>(
	a: T[],
	u?: string
) =>
	a.map(v =>
		v.userId !== u && (v.password || expired(v))
			? { ...v, url: '******', password: v.password ? '******' : null }
			: v
	)
