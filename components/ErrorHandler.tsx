import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export type ErrorType = 'notfound' | 'expired' | 'OAuthAccountNotLinked'
type Error = {
	title: string
	message: string
}

const ERRORS: { [key in ErrorType]: Error } = {
	notfound: {
		title: 'not found',
		message: 'page was not found',
	},
	expired: {
		title: 'expired',
		message: 'page has expired',
	},
	OAuthAccountNotLinked: {
		title: 'account not linked',
		message: 'use different sign in provider',
	},
} as const

export default function ErrorHandler() {
	const router = useRouter()

	useEffect(() => {
		if (!router.query.error) return

		const error = router.query.error as ErrorType
		showNotification({
			title: ERRORS[error]?.title ?? 'error',
			message: ERRORS[error]?.message ?? 'unknown error',
			color: 'red',
		})

		// router.replace('/', undefined, {
		// 	shallow: true,
		// })
	}, [router, router.query.error])

	return null
}
