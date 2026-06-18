import CartPage from '@/components/Pages/Cart/CartPage'
import Footer from '@/components/Pages/Landing/Sections/Footer/Footer'
import React from 'react'
import { generateMetadataObject } from '@/utils/seo';
import { PAGES, DEFAULT_OG_IMAGE } from '@/constants/seo';

export const metadata = generateMetadataObject({
  title: PAGES.cart.title,
  description: PAGES.cart.description,
  keywords: PAGES.cart.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.cart.path,
  noindex: true,
});

const page = () => {
  return (
    <>
      <CartPage />
      <Footer />
    </>
  )
}

export default page
