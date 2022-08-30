import CardWithTitle from '@components/CardWithTitle'
import EmailSignin from '@components/EmailSignIn'
import { Button, Group, Stack } from '@mantine/core'
import { NextLink } from '@mantine/next'
import { ssrAuth } from '@server/utils'
import type { NextPage } from 'next'
import Head from 'next/head'

const SignUpPage: NextPage = () => {
	return (
		<CardWithTitle title="reset password">
			<Head>
				<title>reset password | shurl</title>
			</Head>

			<Stack>
				<EmailSignin callbackUrl="/account#password" />

				<Group position="right">
					<Button component={NextLink} href="/auth/signin" type="submit" variant="light">
						sign in
					</Button>
					<Button component={NextLink} href="/auth/signup" type="submit" variant="light">
						sign up
					</Button>
				</Group>
			</Stack>
		</CardWithTitle>
	)
}

export const getServerSideProps = ssrAuth('/?error=AlreadyLoggedIn', false)

export default SignUpPage
