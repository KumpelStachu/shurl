import { Button, Grid, Group, MantineTheme, SimpleGrid } from '@mantine/core'
import { signIn } from 'next-auth/react'
import CardWithTitle from './CardWithTitle'

const s =
	([c]: TemplateStringsArray, d?: number) =>
	(theme: MantineTheme) => ({
		backgroundColor: c,
		':not(:disabled):hover': { backgroundColor: theme.fn.darken(c, d ?? 0.32) },
	})

export default function SocialLogin() {
	return (
		<CardWithTitle title="social login">
			<Grid grow>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#5865ED`} onClick={() => signIn('discord')} fullWidth>
						discord
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#3B5998`} onClick={() => signIn('facebook')} fullWidth>
						facebook
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#EA4335`} onClick={() => signIn('google')} fullWidth>
						google
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#1B1F22`} onClick={() => signIn('github')} fullWidth>
						github
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#FF4500`} onClick={() => signIn('reddit')} fullWidth>
						reddit
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#1DB954`} onClick={() => signIn('spotify')} fullWidth>
						spotify
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#9146FF`} onClick={() => signIn('twitch')} fullWidth>
						twitch
					</Button>
				</Grid.Col>
				<Grid.Col span={6} md={4}>
					<Button sx={s`#1DA1F2`} onClick={() => signIn('twitch')} fullWidth>
						twitter
					</Button>
				</Grid.Col>
			</Grid>
		</CardWithTitle>
	)
}

// export default function SocialLogin() {
// 	return (
// 		<CardWithTitle title="social login">
// 			<SimpleGrid cols={2} breakpoints={[{ minWidth: 'xs', cols: 3 }]}>
// 				<Button sx={s`#5865ED`} onClick={() => signIn('discord')}>
// 					discord
// 				</Button>
// 				<Button sx={s`#3B5998`} onClick={() => signIn('facebook')}>
// 					facebook
// 				</Button>
// 				<Button sx={s`#EA4335`} onClick={() => signIn('google')}>
// 					google
// 				</Button>
// 				<Button sx={s`#1B1F22`} onClick={() => signIn('github')}>
// 					github
// 				</Button>
// 				<Button sx={s`#FF4500`} onClick={() => signIn('reddit')}>
// 					reddit
// 				</Button>
// 				<Button sx={s`#FF4500`} onClick={() => signIn('spotify')}>
// 					spotify
// 				</Button>
// 					<Button sx={s`#FF4500`} onClick={() => signIn('twitch')}>
// 						twitch
// 					</Button>
// 					<Button sx={s`#FF4500`} onClick={() => signIn('twitch')}>
// 						twitter
// 					</Button>
// 			</SimpleGrid>
// 		</CardWithTitle>
// 	)
// }
