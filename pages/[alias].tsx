import CardWithTitle from '@components/CardWithTitle'
import { Button, FocusTrap, Group, LoadingOverlay, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { prisma } from '@server/prisma'
import { trpc } from '@utils/trpc'
import { expired } from '@utils/utils'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

const RedirectPage: NextPage = () => {
	const checkPassword = trpc.useMutation('shurl.checkPassword', {
		onSuccess: ({ url }) => router.push(url),
		onError: () => form.setFieldError('password', 'invalid passowrd'),
	})
	const router = useRouter()
	const form = useForm({
		initialValues: {
			password: '',
			alias: router.query.alias as string,
		},
	})

	return (
		<CardWithTitle title="password required" order={3}>
			<form onSubmit={form.onSubmit(v => checkPassword.mutate(v))}>
				<LoadingOverlay visible={checkPassword.isLoading} />

				<FocusTrap>
					<Stack>
						<PasswordInput
							required
							label="password"
							placeholder="password"
							autoComplete="new-password"
							{...form.getInputProps('password')}
						/>
						<Group position="right">
							<Button type="submit">submit</Button>
						</Group>
					</Stack>
				</FocusTrap>
			</form>
		</CardWithTitle>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const found = await prisma.shortUrl.findUnique({
		where: {
			alias: ctx.params?.alias as string,
		},
	})

	if (!found)
		return {
			redirect: {
				destination: '/?error=NotFound',
				permanent: true,
			},
		}

	await prisma.shortUrl.update({
		data: {
			visits: {
				increment: 1,
			},
		},
		where: {
			id: found.id,
		},
	})

	if (found.password) return { props: {} }

	return {
		redirect: {
			destination: expired(found) ? '/?error=Expired' : found.url,
			permanent: true,
		},
	}
}

export default RedirectPage
