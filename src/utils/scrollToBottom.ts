/* eslint-disable no-param-reassign */
import { RefObject } from 'react'

export const scrollToBottom = (ref: RefObject<HTMLDivElement>) => {
	if (ref.current) {
		ref.current.scrollTop = ref.current.scrollHeight
		ref.current.scrollBy({ top: ref.current.scrollHeight })
		return null
	}
	return null
}
