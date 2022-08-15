import { NextApiHandler } from 'next'
import superjson from 'superjson'
import { prisma } from '@utils/prisma'
import { randomAlias } from '@utils/utils'

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(405).send('Method Not Allowed')
	}

	const { visits, ...data } = superjson.parse<{
		url: string
		alias: string
		public: boolean
		password: string
		expires: Date | null
		visits?: number
	}>(req.body)

	data.alias ??= randomAlias()

	try {
		const created = await prisma.shortUrl.create({ data })
		if (created.public) await res.revalidate('/recent')

		res.status(200).json(superjson.stringify(created))
	} catch (error) {
		res.status(500).json(error)
	}
}

export default handler
