/* eslint react/no-unknown-property: 0 */
import { FC } from 'react'
import { COLORS } from '@/config/colors'

interface ArrowLeftIconProps {
	size: string
}

export const ArrowLeftIcon: FC<ArrowLeftIconProps> = ({ size }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
		>
			<g id="Complete">
				<g id="arrow-left">
					<g>
						<polyline
							data-name="Right"
							fill="none"
							id="Right-2"
							points="7.6 7 2.5 12 7.6 17"
							stroke={COLORS.gray}
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
						/>

						<line
							fill="none"
							stroke={COLORS.gray}
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							x1="21.5"
							x2="4.8"
							y1="12"
							y2="12"
						/>
					</g>
				</g>
			</g>
		</svg>
	)
}
