const fs = require('fs')

const { Pool } = require('pg')
const pool = new Pool({
	database: 'test'//'defendthecastle'
})

const users = JSON.parse(fs.readFileSync('./Users.backup.JSON').toString())
const stats = JSON.parse(fs.readFileSync('./Stats.backup.JSON').toString())

const log = (text) => console.log('>>', text)

const insert = async (db, table) => {
	let data = {}
	let client = await pool.connect()

	const listKeys = Object.keys(db)
	const query = `
		INSERT
		INTO ${table}(${
			listKeys.join(', ')
		})
		VALUES (${
			listKeys.reduce((t, e, i) => {
				if (i == 0) {
					return '$1'
				}
				return `${t}, $${i+1}`
			}, '')
		})
		RETURNING *;
	`
	await client.query(
		query,
		listKeys.map((e) => db[e])
	).catch(log)
	return await client.release()
}

users.forEach((db) => insert(db, 'users'))
stats.forEach((db) => insert(db, 'stats'))