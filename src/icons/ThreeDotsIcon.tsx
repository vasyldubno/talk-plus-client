import { FC } from 'react'
import { COLORS } from '@/config/colors'

interface ThreeDotsIconProps {
	width: string
	height: string
}

export const ThreeDotsIcon: FC<ThreeDotsIconProps> = ({ height, width }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 32 32"
		>
			<path
				d="M19 16a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3zm0 13a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3zm0-26a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3z"
				fill={COLORS.gray}
			/>
		</svg>
	)
}
