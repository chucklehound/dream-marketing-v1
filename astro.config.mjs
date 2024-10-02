import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config

export default defineConfig({
    site: 'https://usedream.ai',
    integrations: [sitemap({
        customPages: ['https://www.usedream.ai/use-cases/new-territory?lang=fr', 'https://www.usedream.ai/use-cases/new-territory?lang=de', 'https://www.usedream.ai/use-cases/new-territory?lang=es', 'https://www.usedream.ai/use-cases/new-territory?lang=se'],
      })],
});