import type { Metadata } from 'next'
import './globals.css'
export const metadata:Metadata={title:'FlexClass | Studio management, perfectly scheduled',description:'Manage fitness class schedules, capacity, and member enrollments in one clear workspace.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
