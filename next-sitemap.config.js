/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://tappost.io',
  generateRobotsTxt: true,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/api/*',
    '/login',
    '/signup',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api'],
      },
    ],
  },
};
