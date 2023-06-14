/* eslint-disable consistent-return */
import moment from 'moment-timezone'
import 'moment/locale/uk'
import { UserStore } from '@/store/userStore'

export const formatUTCDate = (date: string | undefined, store: UserStore) => {
	const timezone = store.getTimezone()

	if (date && timezone) {
		const utcDate = moment.utc(date).tz(timezone)
		const currentDate = moment().startOf('day')
		const sevenDaysAgo = moment().startOf('day').subtract(7, 'days')

		switch (true) {
			case utcDate.isSame(currentDate, 'day'):
				return utcDate.format('HH:mm')
			case utcDate.isSameOrAfter(sevenDaysAgo, 'day'):
				return utcDate.format('dd')
			case utcDate.isSame(currentDate, 'year'):
				return utcDate.format('DD.MM')
			default:
				return utcDate.format('DD.MM.YYYY')
		}
	}
}
