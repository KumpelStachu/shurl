import { Button, Card, Container, Group } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { IconClock, IconHandClick, IconPlus } from '@tabler/icons'

export default function Navbar() {
	const { ref, height } = useElementSize()

	return (
		<Container size="md" mt="md">
			<Card p="xs" radius="lg">
				<Group ref={ref} position={height > 36 ? 'center' : 'apart'}>
					<Button component={NextLink} href="/" variant="subtle" leftIcon={<IconPlus size={20} />}>
						create new shurl
					</Button>
					<Group position="center">
						<Button component={NextLink} href="/top" variant="subtle" leftIcon={<IconHandClick size={20} />}>
							top shurls
						</Button>
						<Button component={NextLink} href="/recent" variant="subtle" leftIcon={<IconClock size={20} />}>
							recent shurls
						</Button>
					</Group>
				</Group>
			</Card>
		</Container>
	)
}
