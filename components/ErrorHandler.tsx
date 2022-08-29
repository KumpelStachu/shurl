import { useDidUpdate } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export type ErrorType = 'NotFound' | 'Expired' | 'AlreadyLoggedIn' | 'OAuthAccountNotLinked'
type Error = {
	title: string
	message: string
}

const ERRORS: { [key in ErrorType]: Error } = {
	NotFound: {
		title: 'not found',
		message: 'page was not found',
	},
	Expired: {
		title: 'expired',
		message: 'page has expired',
	},
	AlreadyLoggedIn: {
		title: 'already logged in',
		message: '',
	},
	OAuthAccountNotLinked: {
		title: 'account not linked',
		message: 'use different sign in provider',
	},
} as const

export default function ErrorHandler() {
	const router = useRouter()

	useDidUpdate(() => {
		if (!router.query.error) return

		const error = router.query.error as ErrorType
		showNotification({
			title: ERRORS[error]?.title ?? 'error',
			message: ERRORS[error]?.message ?? 'unknown error',
			color: 'red',
		})
	}, [router, router.query.error])

	return null
}
