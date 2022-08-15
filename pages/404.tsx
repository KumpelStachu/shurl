import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const NotFoundPage: NextPage = () => {
	const router = useRouter()

	useEffect(() => {
		router.replace('/?error=notfound')
	})

	return null
}

export default NotFoundPage
