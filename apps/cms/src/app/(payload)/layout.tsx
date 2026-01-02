/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import './custom.scss'

export const metadata: Metadata = {
  title: 'MA3 CMS',
  description: 'Content Management System for MA3 World',
}

export default RootLayout({
  config,
  importMap,
  serverFunctions: handleServerFunctions,
})
