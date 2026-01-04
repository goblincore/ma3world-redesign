/**
 * Seed script to populate PayloadCMS with sample data
 * Run with: npx tsx src/seed.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  console.log('🌱 Starting seed...')
  
  const payload = await getPayload({ config })
  
  // Clear existing data (optional - comment out if you want to keep existing)
  console.log('🧹 Clearing existing data...')
  await payload.delete({ collection: 'news', where: { id: { exists: true } } })
  await payload.delete({ collection: 'projects', where: { id: { exists: true } } })
  
  // ============================================
  // PROJECTS
  // ============================================
  console.log('📦 Creating projects...')
  
  const imabariProject = await payload.create({
    collection: 'projects',
    data: {
      title: 'Imabari Towel Digital Art Gallery',
      slug: 'imabari-towel',
      category: 'Digital Innovation / Art',
      year: '2024',
      description: 'A hybrid cultural innovation project that transforms digital creativity into physical products, exhibitions, and sustainable economic value. This gallery bridges global artists and local industries.',
      featured: true,
      client: 'Imabari Towel',
      heroVideo: '/video/imabariditigalartgallery.mp4',
    },
    locale: 'en',
  })
  
  // Add Japanese translation
  await payload.update({
    collection: 'projects',
    id: imabariProject.id,
    data: {
      title: '今治タオル デジタルアートギャラリー',
      category: 'デジタル・イノベーション / アート',
      description: 'デジタルの創造性を物理的な製品、展示、そして持続可能な経済価値へと変革するハイブリッドなカルチャー・イノベーション・プロジェクト。',
    },
    locale: 'ja',
  })
  
  const fukushimaProject = await payload.create({
    collection: 'projects',
    data: {
      title: 'MA3.0 YUA Rice Leather Fukushima Cheer Project',
      slug: 'fukushima-yuacheer',
      category: 'Social Innovation / Design',
      year: '2024',
      description: 'Revitalizing local industry through sustainable, locally-sourced vegan leather made from rice. Supporting Fukushima reconstruction through innovative design.',
      featured: true,
      client: 'Fukushima Prefecture',
    },
    locale: 'en',
  })
  
  await payload.update({
    collection: 'projects',
    id: fukushimaProject.id,
    data: {
      title: 'MA3.0 YUA ライスレザー福島復興支援応援プロジェクト',
      category: 'ソーシャル・イノベーション / デザイン',
      description: '地元産の米を原料としたサステナブルなヴィーガンレザーで地域産業を活性化。革新的なデザインを通じて福島の復興を支援します。',
    },
    locale: 'ja',
  })
  
  const avatarProject = await payload.create({
    collection: 'projects',
    data: {
      title: 'MA3.0 Avatar',
      slug: 'ma3-avatar',
      category: 'Talent / Technology',
      year: '2024',
      description: 'Digital avatars merging talent × technology × local identity. Creating virtual ambassadors that represent the spirit of regional cultures in the metaverse.',
      featured: true,
    },
    locale: 'en',
  })
  
  await payload.update({
    collection: 'projects',
    id: avatarProject.id,
    data: {
      title: 'MA3.0 アバター',
      category: 'タレント / テクノロジー',
      description: 'タレント × テクノロジー × 地域アイデンティティを融合したデジタルアバター。メタバースで地域文化の精神を代表するバーチャル大使を創造。',
    },
    locale: 'ja',
  })
  
  const neoTokyoProject = await payload.create({
    collection: 'projects',
    data: {
      title: 'Neo-Tokyo 2099: Digital Fashion Week',
      slug: 'neo-tokyo-2099',
      category: 'Fashion / XR',
      year: '2025',
      description: 'A groundbreaking virtual fashion experience blending traditional Japanese aesthetics with cyberpunk futurism. Showcasing digital-first designs in an immersive XR environment.',
      featured: false,
    },
    locale: 'en',
  })
  
  await payload.update({
    collection: 'projects',
    id: neoTokyoProject.id,
    data: {
      title: 'ネオ東京2099: デジタルファッションウィーク',
      category: 'ファッション / XR',
      description: '日本の伝統美とサイバーパンク未来主義を融合した革新的なバーチャルファッション体験。没入型XR環境でデジタルファーストのデザインを披露。',
    },
    locale: 'ja',
  })
  
  const sakuraAIProject = await payload.create({
    collection: 'projects',
    data: {
      title: 'Sakura AI: Regional Tourism Revival',
      slug: 'sakura-ai-tourism',
      category: 'AI / Tourism',
      year: '2025',
      description: 'An AI-powered cultural guide that brings forgotten rural destinations to life. Combining generative storytelling with AR experiences to revitalize local tourism.',
      featured: false,
    },
    locale: 'en',
  })
  
  await payload.update({
    collection: 'projects',
    id: sakuraAIProject.id,
    data: {
      title: 'サクラAI: 地方観光復興',
      category: 'AI / 観光',
      description: '忘れられた地方の目的地に命を吹き込むAI搭載の文化ガイド。生成ストーリーテリングとAR体験を組み合わせ、地域観光を活性化。',
    },
    locale: 'ja',
  })
  
  // ============================================
  // NEWS
  // ============================================
  // ============================================
  // NEWS
  // ============================================
  console.log('📰 Creating news items...')

  // Helper to create simple Rich Text content
  const createContent = (text: string) => ({
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1
            }
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0,
          textStyle: '',
          version: 1
        }
      ],
      direction: 'ltr' as const
    }
  })
  
  await payload.create({
    collection: 'news',
    data: {
      title: 'Imabari Towel Digital Art Gallery: Phase II Launch',
      slug: 'imabari-towel-phase-ii',
      date: '2024-06-15',
      description: 'Building on the success of the initial launch, we are excited to announce the expansion of our digital art gallery, bridging local heritage with global digital art.',
      content: createContent('We are thrilled to unveil Phase II of the Imabari Towel Digital Art Gallery. This expansion introduces five new interactive exhibits featuring collaborations between traditional towel weavers and digital artists from around the world. Visit us to experience the future of textile art.'),
      linkType: 'detail',
      project: imabariProject.id,
    },
    locale: 'en',
  })
  
  await payload.create({
    collection: 'news',
    data: {
      title: 'MA3.0 Wins Innovation Award at Tokyo Design Week',
      slug: 'ma30-wins-innovation-award',
      date: '2024-11-20',
      description: 'Our Fukushima Rice Leather project was honored with the Sustainability Innovation Award, recognizing our commitment to eco-conscious design and community revitalization.',
      content: createContent('The MA3.0 team is honored to receive the Sustainability Innovation Award at this year\'s Tokyo Design Week. This recognition validates our mission to use technology and design to solve regional challenges. Special thanks to our partners in Fukushima Prefecture and the YUA community.'),
      linkType: 'detail',
      project: fukushimaProject.id,
    },
    locale: 'en',
  })
  
  await payload.create({
    collection: 'news',
    data: {
      title: 'Neo-Tokyo 2099 Announced for Spring 2025',
      slug: 'neo-tokyo-2099-announced',
      date: '2025-01-02',
      description: 'Get ready for the future of fashion. Our upcoming XR fashion experience will debut in Tokyo, featuring collaborations with legendary Japanese designers and emerging digital artists.',
      content: createContent('Neo-Tokyo 2099 is set to redefine the fashion runway. By combining XR (Extended Reality) technology with avant-garde fashion design, we are creating an immersive experience that transcends physical boundaries. Tickets go on sale next month.'),
      linkType: 'project', // Link directly to the project page for this one
      project: neoTokyoProject.id,
    },
    locale: 'en',
  })
  
  await payload.create({
    collection: 'news',
    data: {
      title: 'Partnership with Niigata Prefecture for AI Tourism Initiative',
      slug: 'niigata-ai-tourism-partnership',
      date: '2025-01-04',
      description: 'MA3.0 World partners with Niigata Prefecture to deploy Sakura AI across 50 rural locations, creating immersive cultural experiences for international visitors.',
      content: createContent('We are proud to announce a strategic partnership with Niigata Prefecture. "Sakura AI" will be deployed in 50 key cultural sites, providing multilingual, interactive guides for visitors. This initiative aims to revitalize rural tourism through cutting-edge technology.'),
      linkType: 'detail',
      project: sakuraAIProject.id,
    },
    locale: 'en',
  })
  
  await payload.create({
    collection: 'news',
    data: {
      title: 'MA3.0 Featured in Wired Japan',
      slug: 'ma30-featured-wired-japan',
      date: '2024-09-15',
      description: 'Our approach to bridging traditional craftsmanship with cutting-edge digital experiences was featured in Wired Japan\'s annual innovation issue.',
      linkType: 'external',
      externalUrl: 'https://wired.jp/',
    },
    locale: 'en',
  })
  
  console.log('✅ Seed complete!')
  console.log(`   - ${5} projects created`)
  console.log(`   - ${5} news items created`)
  
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
