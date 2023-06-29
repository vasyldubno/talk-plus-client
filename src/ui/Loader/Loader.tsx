/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { GridLoader } from 'react-spinners'
import { useStore } from '@/hooks/useStore'

interface LoaderProps {
	isOpen: boolean
}

export const Loader: FC = observer(() => {
	const store = useStore()
	const isLoading = store.getIsLoading()

	return (
		<Modal isOpen={isLoading} onClose={() => {}}>
			<ModalOverlay />
			<ModalContent bg="transparent" shadow="none">
				<Box className="text-center">
					<GridLoader color="purple" size={100} speedMultiplier={1} />
				</Box>
			</ModalContent>
		</Modal>
	)
})
