import CardWithTitle from '@components/CardWithTitle'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { NextLink } from '@mantine/next'
import { nextAuthOptions } from '@pages/api/auth/[...nextauth]'
import { IconAt } from '@tabler/icons'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'

const SignUpPage: NextPage = () => {
	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			email: '',
		},
	})

	return (
		<CardWithTitle title="reset password">
			<Head>
				<title>reset password | shurl</title>
			</Head>

			<form onSubmit={form.onSubmit(() => {})}>
				<Stack spacing="xs">
					<Group align="end">
						<TextInput
							required
							sx={{ flex: 1 }}
							icon={<IconAt size={20} />}
							label="email"
							type="email"
							{...form.getInputProps('email')}
						/>
						<Button type="submit">send email</Button>
					</Group>

					<Group mt="sm" position="right">
						<Button component={NextLink} href="/auth/signin" type="submit" variant="light">
							sign in
						</Button>
						<Button component={NextLink} href="/auth/signup" type="submit" variant="light">
							sign up
						</Button>
					</Group>
				</Stack>
			</form>
		</CardWithTitle>
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

export default SignUpPage
