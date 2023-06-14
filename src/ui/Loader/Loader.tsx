import { Box } from '@chakra-ui/react'
import { FC } from 'react'
import { GridLoader } from 'react-spinners'

export const Loader: FC = () => {
	return (
		<Box className="text-center h-[100vh]">
			<GridLoader color="purple" size={100} speedMultiplier={1} />
		</Box>
	)
}
