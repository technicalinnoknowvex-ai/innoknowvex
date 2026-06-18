import TechStarter from '@/components/Pages/TechStarterPack/TechStarter'
import React from 'react'
import { generateMetadataObject } from '@/utils/seo';
import { PAGES, DEFAULT_OG_IMAGE } from '@/constants/seo';

export const metadata = generateMetadataObject({
  title: PAGES.techStarterPack.title,
  description: PAGES.techStarterPack.description,
  keywords: PAGES.techStarterPack.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.techStarterPack.path,
  type: "website",
});

const page = () => {
  return (
    <TechStarter/>
  )
}

export default page