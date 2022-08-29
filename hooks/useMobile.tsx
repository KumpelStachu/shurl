import { useOs } from '@mantine/hooks'

export default function useMobile() {
	const os = useOs()
	return os === 'android' || os === 'ios'
}
