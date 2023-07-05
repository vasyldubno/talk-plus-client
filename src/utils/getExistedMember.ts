import { Dispatch, SetStateAction } from 'react'
import { supabase } from '@/config/supabase'
import { IChat } from '@/types/types'

export const getExistedMembers = async ({
	chat,
	setState,
}: {
	chat: IChat
	setState: Dispatch<SetStateAction<any[]>>
}) => {
	const responseExistedMembers = await supabase
		.from('members')
		.select()
		.eq('chat_id', chat.id)

	if (responseExistedMembers.data) {
		const existedMembersUserIds = responseExistedMembers.data.map(
			(existMember) => existMember.user_id,
		)

		const res = await supabase
			.from('users')
			.select('username')
			.in('id', existedMembersUserIds)

		if (res.data) {
			const existedMembersFirstNames = res.data.map(
				(exMember) => exMember.username,
			)

			setState(existedMembersFirstNames)
		}
	}
}
