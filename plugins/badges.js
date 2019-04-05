const badges = require('../badges').list

const quests = (ctx) => {
	if (ctx.badges(ctx.from.id).length >= 1 && !ctx.session.quest) {
		return ctx.replyWithHTML(ctx._`
📦 #Quest <a href="https://telegram.me/DefendTheCastleBot?start=05aprID2652341456">Open (Click Here)</a>
		`)
	}
}

const base = async (ctx) => {
	let text = ctx._`<b>My badges:</b>\n`
	const myBadges = ctx.badges(ctx.from.id)
	if (myBadges.length <= 0) {
		text += ctx._`You don't have badges!`
	} else {
		text += '• ' + myBadges.map(el => `${el.icon} ${el.title}`).join('\n• ')
	}

	quests(ctx)

	const keyBadges = Object.keys(badges).reduce((total, id, index) => {
		const badge = badges[id]
		const key = {text: badge.icon, callback_data: `badges:${badge.id}`}
		total[total.length - 1].push(key)
		if (total[total.length - 1].length >= 5) {
			total.push([])
		}
		return total
	}, [
		[]
	])
	const keyboard = [
		...keyBadges,
		[
			{text: ctx._`📜 Menu` , callback_data: 'menu'},
		]
	]

	if (ctx.match[2]) {
		const badge = badges[ctx.match[2]]
		text = ctx._`
<b>Badge:</b>
${badge.icon} - ${badge.title}
${badge.desc}`
	}

	if (ctx.updateType == 'callback_query') {
		return ctx.editMessageText(text + ctx.fixKeyboard, {
			parse_mode: 'HTML',
			reply_markup: {
				inline_keyboard: keyboard
			},
			disable_web_page_preview: true
		})
	}
	return ctx.replyWithHTML(text + ctx.fixKeyboard, {
		reply_markup: {
			inline_keyboard: keyboard
		},
		disable_web_page_preview: true
	})
}

module.exports = {
	id: 'badges',
	callback: base,
	plugin: base,
	onlyUser: true,
	regex: [
		/^\/(badges) (\w+)/i,
	]
}