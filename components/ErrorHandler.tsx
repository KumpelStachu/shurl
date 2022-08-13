import type { NotificationProps } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export type ErrorType = 'notfound' | 'expired'
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
	}, [router.query.error])

	return null
}
