import { FC, PropsWithChildren } from 'react'

interface ContainerProps {
	className?: string
}

export const Container: FC<PropsWithChildren & ContainerProps> = ({
	children,
	className,
}) => {
	return (
		<>
			<div className={`max-w-5xl my-0 mx-auto ${className}`}>{children}</div>
		</>
	)
}

Container.defaultProps = { className: '' }
