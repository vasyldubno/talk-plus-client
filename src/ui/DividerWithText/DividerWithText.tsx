import s from './DividerWithText.module.scss'
import { Box } from '@chakra-ui/react'
import { CSSProperties, FC } from 'react'

interface DividerWithTextProps {
	text: string
	styles?: CSSProperties
}

export const DividerWithText: FC<DividerWithTextProps> = ({ text, styles }) => {
	return (
		<Box className={s.dividerBreak} style={styles}>
			<h5>{text}</h5>
		</Box>
	)
}
