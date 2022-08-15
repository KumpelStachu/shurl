import type { ShortUrl } from '@prisma/client'

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }) //timeStyle: 'short'
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

export const randomAlias = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)

export const expired = ({ expires }: Pick<ShortUrl, 'expires'>) => (expires ?? new Date()) < new Date()

export const transformShurls = (a: ShortUrl[]) =>
	a.map(v => (v.password || expired(v) ? { ...v, url: '******', password: v.password ? '******' : null } : v))
