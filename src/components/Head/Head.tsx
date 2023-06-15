import { FC, PropsWithChildren } from 'react'
import HeadNext from 'next/head'
import { METADATA } from '@/config/metadata'

export const Head: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<HeadNext>
				<title>{METADATA.title}</title>
			</HeadNext>
			{children}
		</>
	)
}
