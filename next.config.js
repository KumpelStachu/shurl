const { withSuperjson } = require('next-superjson')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},
}

module.exports = withSuperjson()(withBundleAnalyzer(nextConfig))
