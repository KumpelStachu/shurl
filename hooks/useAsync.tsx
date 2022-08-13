import { useCallback, useState } from 'react'

export default function useAsync<T, E = { error: string }>(fn: () => Promise<T | null>) {
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState<T | null>(null)
	const [error, setError] = useState<E | null>(null)

	const execute = useCallback(async () => {
		setLoading(true)
		setValue(null)
		setError(null)
		try {
			const response = await fn()
			setValue(response)
			setError(null)
		} catch (error) {
			setError(error as E)
			setValue(null)
		}
		setLoading(false)
	}, [fn])

	return [{ value, loading, error }, execute]
}
