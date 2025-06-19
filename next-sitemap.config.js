const config = {
  siteUrl: 'https://gopal-nepal.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*'],
  transform: async (config, path) => {
    // Exclude all /admin paths
    if (path.startsWith('/admin')) {
      return null;
    }

    let priority = 0.5; // default

    if (path === '/') priority = 1.0;
    else if (path === '/about') priority = 0.9;
    else if (path === '/blog') priority = 0.8;
    else if (path === '/news') priority = 0.7;
    else if (path === '/gallery' || path === '/videos') priority = 0.6;
    else if (path === '/contact') priority = 0.5;

    return {
      loc: path,
      changefreq: 'daily',
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};

export default config;
