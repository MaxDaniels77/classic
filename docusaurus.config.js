// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fravega Docs',
  tagline: 'Documentaciones de Fravega',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://fravedocusdev.netlify.app/',
  // url: 'http://192.168.0.46:3000',



  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: 'https://fravedocusdev.netlify.app/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Fravega', // Usually your GitHub org/user name.
  projectName: 'classic', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // plugins: ["@orama/plugin-docusaurus-v3"],
  // plugins: [require.resolve('docusaurus-lunr-search')],


  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          exclude: ['**/docs/Advanced Analytics/_resources/**'],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */



    ({
      algolia: {
              // La configuración de Algolia va aquí
              appId: 'BNTCJ45XUO',
              apiKey: '866de7dc540f390c03b1874cabb66036',
              indexName: 'fraveusdev',
              contextualSearch: true,
              externalUrlRegex: 'external\\.com|domain\\.com',
              replaceSearchResultPathname: {
                from: '/docs/',
                to: '/',
              },
              searchParameters: {},
              searchPagePath: 'search',
              debug: false,
            },



      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Fravega Docs',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo_sin_fondo_3.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/MaxDaniels77/classic',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Docusaurus Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/MaxDaniels77/classic',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Frávega,  Inc. Made By Daniel Arias using Docusaurus.`,
      },
      prism: {
        theme: prismThemes.dracula,
        darkTheme: prismThemes.dracula,
      },
    }),
  
};

// module.exports = {
//   // Otras configuraciones de Docusaurus...

//   customFields: {
//     algolia: {
//       // La configuración de Algolia va aquí
//       appId: 'BNTCJ45XUO',
//       apiKey: '866de7dc540f390c03b1874cabb66036',
//       indexName: 'fraveusdev',
//       contextualSearch: true,
//       externalUrlRegex: 'external\\.com|domain\\.com',
//       replaceSearchResultPathname: {
//         from: '/docs/',
//         to: '/',
//       },
//       searchParameters: {},
//       searchPagePath: 'search',
//       debug: false,
//     },
//   },
// };




export default config;


