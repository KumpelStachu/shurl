import CardWithTitle from '@components/CardWithTitle'
import EmailSignin from '@components/EmailSignIn'
import SocialLogin from '@components/SocialLogin'
import {
	Button,
	Card,
	Divider,
	Group,
	LoadingOverlay,
	PasswordInput,
	Stack,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { NextLink } from '@mantine/next'
import { showNotification } from '@mantine/notifications'
import { nextAuthOptions } from '@pages/api/auth/[...nextauth]'
import { IconKey, IconUser } from '@tabler/icons'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const SignInPage: NextPage = () => {
	const router = useRouter()
	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			username: '',
			password: '',
		},
	})

	async function handleSubmit({ username, password }: typeof form.values) {
		if (1) return
		const res = await signIn('credentials', {
			redirect: false,
			username,
			password,
		})

		if (res?.ok) {
			location.pathname = (router.query.next ?? router.query.callback ?? '/') as string
		} else {
			showNotification({
				color: 'red',
				title: 'error',
				message: res?.error,
			})
		}
	}

	return (
		<Stack>
			<Head>
				<title>signin | shurl</title>
			</Head>

			<SocialLogin />

			<CardWithTitle title="passwordless auth">
				<EmailSignin />
			</CardWithTitle>

			<Divider label="or" labelPosition="center" />

			<Card shadow="md">
				<LoadingOverlay visible overlayBlur={2} overlayOpacity={0.9} loader={<Title>coming soon</Title>} />

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="xs">
						<TextInput
							required
							icon={<IconUser size={20} />}
							label="username or email"
							type={form.values.username.includes('@') ? 'email' : 'text'}
							autoComplete={form.values.username.includes('@') ? 'email' : 'username'}
							{...form.getInputProps('username')}
						/>

						<PasswordInput
							required
							icon={<IconKey size={20} />}
							label="password"
							autoComplete="password"
							{...form.getInputProps('password')}
						/>

						<Group mt="xs" position="right">
							<Button component={NextLink} href="/auth/reset-password" type="submit" variant="light">
								reset password
							</Button>
							<Button component={NextLink} href="/auth/signup" type="submit" variant="light">
								sign up
							</Button>
							<Button type="submit">sign in</Button>
						</Group>
					</Stack>
				</form>
			</Card>
		</Stack>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions)

	return session
		? {
				redirect: {
					destination: '/',
					permanent: false,
				},
		  }
		: { props: {} }
}

export default SignInPage
