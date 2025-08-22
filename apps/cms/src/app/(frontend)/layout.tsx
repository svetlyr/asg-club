import React from 'react'
import './styles.css'

export const metadata = {
  title: 'ASG Club Payload CMS',
}

type Props = {
  children: React.ReactNode
}
export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
