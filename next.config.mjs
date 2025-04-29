/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media*.giphy.com",
				port: "",
				pathname: "/**",
			},
		],
		domains: ["i.scdn.co"], // Add Spotify's image domain
	},
};

export default nextConfig;
