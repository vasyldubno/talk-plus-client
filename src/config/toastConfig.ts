import { Slide, ToastOptions } from 'react-toastify'

export const toastConfig: ToastOptions = {
	position: 'top-right',
	autoClose: 5000,
	delay: 500,
	transition: Slide,
	hideProgressBar: true,
	closeOnClick: false,
	pauseOnHover: false,
	draggable: false,
	progress: undefined,
	theme: 'dark',
}
