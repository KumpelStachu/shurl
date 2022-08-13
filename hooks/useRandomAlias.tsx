import { randomAlias } from '@utils/utils'
import { useEffect, useState } from 'react'

export default function useRandomAlias() {
	const [state, setState] = useState<string>()

	useEffect(() => {
		setState(randomAlias())
	}, [])

	return state
}
