const TAFFY = require('taffy')
const moment = require('moment')
const Member = require('../models/member')

let memberDB

function loadMembers () {
  console.log('loading members into cache...')
  Member.find({$or: [{ state: 'MA' }, { state: 'RI' }]},
    (err, docs) => {
      if (err) {
        console.log('Failed to read members from DB')
        return
      }
      let members = docs.filter(isActiveMember)
      console.log(`Loaded ${ members.length } members into cache for rapid searching`)
      memberDB = TAFFY(members)
    })
}

function isActiveMember (json) {
  let active = true
  // life member
  if (json.expirationDate === '12/31/99') return active
  let refDate = moment('12/31/17', 'M/D/YY')
  let expireDate = moment(json.expirationDate, 'M/D/YY')
  active = (expireDate.diff(refDate, 'days', true)) > 0
  return active
}

function searchMembers (keyword, callback) {
  let rst = memberDB([
    { firstName: { likenocase: keyword }}
  ]).get()
  callback(null, rst)
}

setTimeout(loadMembers, 3000)

module.exports = {
  searchMembers
}
