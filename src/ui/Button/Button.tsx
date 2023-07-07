import s from './Button.module.scss'
import { FC, useState } from 'react'

interface ButtonProps {
	content: string
	backgroundColor: string
	hoverBackgroundColor: string
	textColor: string
	onClick?: () => void
}

export const Button: FC<ButtonProps> = ({
	backgroundColor,
	content,
	hoverBackgroundColor,
	textColor,
	onClick,
}) => {
	const [isHover, setIsHover] = useState(false)

	return (
		<button
			type="submit"
			style={{
				backgroundColor: isHover ? hoverBackgroundColor : backgroundColor,
				color: textColor,
			}}
			className={s.button}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={onClick}
		>
			{content}
		</button>
	)
}
