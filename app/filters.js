//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter
const addFunction = govukPrototypeKit.views.addFunction

// Add your filters here

// Returns a date a given number of days from today, formatted like "6 May 2026"
addFunction('daysFromNow', function (days) {
  const date = new Date()
  date.setDate(date.getDate() + Number(days))
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})

