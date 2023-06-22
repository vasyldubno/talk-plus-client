import { $axios } from '@/config/axiosConfig'

const TestPage = () => {
	return (
		<>
			<button
				type="button"
				onClick={async () => {
					await $axios.post('/users/redirect?email=test@gmail.com')
				}}
			>
				click
			</button>
		</>
	)
}

export default TestPage
