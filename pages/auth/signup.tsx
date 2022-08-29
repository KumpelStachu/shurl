import SocialLogin from '@components/SocialLogin'
import {
	Button,
	Card,
	Divider,
	Group,
	Loader,
	LoadingOverlay,
	PasswordInput,
	Stack,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { showNotification } from '@mantine/notifications'
import { nextAuthOptions } from '@pages/api/auth/[...nextauth]'
import { ssrAuth } from '@server/utils'
import { IconAt, IconKey, IconUser, IconUserCheck, IconUserX } from '@tabler/icons'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const SignUpPage: NextPage = () => {
	const router = useRouter()
	const theme = useMantineTheme()
	const small = useMediaQuery(`(max-width: ${(theme.breakpoints.xs * 3) / 4}px)`, false)
	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validate: {
			confirmPassword: (value, values) => value !== values.password && 'passwords does not match',
		},
	})

	const [username] = useDebouncedValue(form.values.username.trim(), 500)
	const checkUsername = trpc.useQuery(['auth.checkUsername', username], {
		enabled: !!username,
		retry: false,
		onSuccess(success) {
			if (!success) form.setFieldError('username', 'username is taken')
		},
		onError() {
			form.setFieldError('username', 'invalid username')
		},
	})

	const [email] = useDebouncedValue(form.values.email.trim(), 500)
	const checkEmail = trpc.useQuery(['auth.checkEmail', email], {
		enabled: !!email,
		retry: false,
		onSuccess(success) {
			if (!success) form.setFieldError('email', 'email is taken')
		},
		onError() {
			form.setFieldError('email', 'invalid email')
		},
	})

	const signUp = trpc.useMutation(['auth.signUp'], {
		async onSuccess(_, v) {
			await signIn('credentials', v)
			location.pathname = (router.query.next ?? router.query.callback ?? '/') as string
		},
		onError(error) {
			showNotification({
				color: 'red',
				title: error.message,
				message: `error ${error.data?.code}`,
				autoClose: 2000,
			})
		},
	})

	return (
		<Stack>
			<Head>
				<title>signup | shurl</title>
			</Head>

			<SocialLogin />

			<Divider label="or" labelPosition="center" />

			<Card shadow="md">
				<LoadingOverlay visible overlayBlur={2} overlayOpacity={0.9} loader={<Title>coming soon</Title>} />
				<form onSubmit={form.onSubmit(v => 0 && signUp.mutate(v))}>
					<LoadingOverlay visible={signUp.isLoading} />
					<Stack spacing="xs">
						<TextInput
							required
							icon={
								!username ? (
									<IconUser size={20} />
								) : checkUsername.isLoading ? (
									<Loader size="xs" />
								) : checkUsername.data ? (
									<IconUserCheck size={20} color={theme.fn.themeColor('green', 6)} />
								) : (
									<IconUserX size={20} color={theme.fn.themeColor('red', 6)} />
								)
							}
							label="username"
							name="username"
							{...form.getInputProps('username')}
						/>

						<TextInput
							required
							icon={
								!email ? (
									<IconAt size={20} />
								) : checkEmail.isLoading ? (
									<Loader size="xs" />
								) : (
									<IconAt size={20} color={theme.fn.themeColor(checkEmail.data ? 'green' : 'red', 6)} />
								)
							}
							label="email"
							type="email"
							{...form.getInputProps('email')}
						/>

						{small ? (
							<Stack>
								<PasswordInput
									required
									icon={<IconKey size={20} />}
									label="password"
									autoComplete="new-password"
									{...form.getInputProps('password')}
								/>
								<PasswordInput
									required
									icon={<IconKey size={20} />}
									label="confirm password"
									autoComplete="new-password"
									{...form.getInputProps('confirmPassword')}
								/>
							</Stack>
						) : (
							<Group grow align="start">
								<PasswordInput
									required
									icon={<IconKey size={20} />}
									label="password"
									autoComplete="new-password"
									{...form.getInputProps('password')}
								/>
								<PasswordInput
									required
									icon={<IconKey size={20} />}
									label="confirm password"
									autoComplete="new-password"
									{...form.getInputProps('confirmPassword')}
								/>
							</Group>
						)}

						<Group mt="xs" position="right">
							<Button component={NextLink} href="/auth/signin" type="submit" variant="light">
								sign in
							</Button>
							<Button type="submit">sign up</Button>
						</Group>
					</Stack>
				</form>
			</Card>
		</Stack>
	)
}

export const getServerSideProps = ssrAuth('/?error=AlreadyLoggedIn', false)

export default SignUpPage
