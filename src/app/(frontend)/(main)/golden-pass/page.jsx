import React from 'react'
import GoldenPack from '@/components/Pages/GoldenPass/GoldenPack'
import { generateMetadataObject } from '@/utils/seo';
import { PAGES, DEFAULT_OG_IMAGE } from '@/constants/seo';

export const metadata = generateMetadataObject({
  title: PAGES.goldenPass.title,
  description: PAGES.goldenPass.description,
  keywords: PAGES.goldenPass.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.goldenPass.path,
  type: "website",
});

const page = () => {
  return (
    <GoldenPack/>
  )
}

export default page