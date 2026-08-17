//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

var version = "v3";


//router.post('/'+ version +'/investigator/start-request-for-info', function(request, response) {


		//response.redirect("add-providor")

//})

//router.post('/'+ version +'/investigator/add-benefit', function(request, response) {


		//response.redirect("add-providor")

//})

router.post('/'+ version +'/investigator/add-providor', function(request, response) {


		response.redirect("add-category")

})

router.post('/'+ version +'/investigator/add-category', function(request, response) {


	var categoryType = request.session.data['categoryType']
	if (categoryType == "Finance"){
		response.redirect ("add-subject-financial")
	}
    else if (categoryType == "Employment"){
        response.redirect("add-subject-employment")
    }
    else {
		response.redirect("add-subject-other")
	}
})


router.post('/' + version + '/investigator/add-subject-financial', function(request, response) {

    var requestType = request.session.data['requestType']
    if (requestType == "Accounts and bank statements"){
        response.redirect("add-subject-financial-accounts")
    }
    else if (requestType == "Specific transaction details"){
        response.redirect("add-subject-financial-transaction")
    }
    else if (requestType == "Loans and mortgages"){
        response.redirect("add-subject-financial-loans")
    }
    else {
        response.redirect("add-subject-other")
    }

})

router.post('/'+ version +'/investigator/add-subject-financial-accounts', function(request, response) {


		response.redirect("bank-account-request")

})

router.post('/'+ version +'/investigator/accounts-request', function(request, response) {


		response.redirect("bank-account-request")

})

router.post('/'+ version +'/investigator/bank-account-request', function(request, response) {
	// Normalise the checkbox selections (a single checkbox arrives as a string)
	var accountInfo = request.session.data['account-info']
	var details = accountInfo ? (Array.isArray(accountInfo) ? accountInfo : [accountInfo]) : []
	var holderAccountInfo = request.session.data['holder-account-info']
	var holderDetails = holderAccountInfo ? (Array.isArray(holderAccountInfo) ? holderAccountInfo : [holderAccountInfo]) : []

	// Only ask for a statement date range when statements have actually been requested,
	// either via the "Do you want bank statements for this account?" radio, the "for the
	// account holder" checkbox, or the "other accounts held by this provider" checkbox.
	var wantsStatements = request.session.data['bank-state'] == "Yes" || details.indexOf("Bank statements") !== -1 || holderDetails.indexOf("Bank statements") !== -1

	if (wantsStatements) {
		response.redirect("bank-account-request-2")
	} else {
		response.redirect("bank-account-request-3")
	}
})

router.post('/'+ version +'/investigator/bank-account-request-2', function(request, response) {
		response.redirect("bank-account-request-3")
})

router.post('/'+ version +'/investigator/bank-account-request-3', function(request, response) {
	// Save the account the investigator has just finished entering before moving on to
	// the "add another account" decision. Capturing it here (rather than only when the
	// user finally answers "No") means every account in the loop is stored, and the
	// add-another-account page can show an accurate running count.

	// Initialise accounts array if it doesn't exist
	if (!request.session.data['accounts']) {
		request.session.data['accounts'] = []
	}

	// Work out which details the user actually entered so the summary only shows those
	var hasDob = request.session.data['dob-day'] || request.session.data['dob-month'] || request.session.data['dob-year']
	var hasAddress = request.session.data['address-line-1'] || request.session.data['address-line-2'] || request.session.data['addressTown'] || request.session.data['addressPostcode']
	var hasBankDetails = request.session.data['sortCode'] || request.session.data['accountNo'] || request.session.data['cardNo'] || request.session.data['rollNumber']
	var hasStatementDates = request.session.data['start-day'] || request.session.data['start-month'] || request.session.data['start-year']
	var hasEndDate = request.session.data['end-day'] || request.session.data['end-month'] || request.session.data['end-year']
	var hasAddrHistDates = request.session.data['addr-start-day'] || request.session.data['addr-start-month'] || request.session.data['addr-start-year']
	var hasAddrHistEndDate = request.session.data['addr-end-day'] || request.session.data['addr-end-month'] || request.session.data['addr-end-year']

	// A blank statement end date means "up to today", so populate it with today's date
	var todayDate = new Date()
	var today = todayDate.getDate() + '/' + (todayDate.getMonth() + 1) + '/' + todayDate.getFullYear()
	var statementDateRange = hasStatementDates ? ((request.session.data['start-day'] || '') + '/' + (request.session.data['start-month'] || '') + '/' + (request.session.data['start-year'] || '') + ' to ' + (hasEndDate ? ((request.session.data['end-day'] || '') + '/' + (request.session.data['end-month'] || '') + '/' + (request.session.data['end-year'] || '')) : today)) : ''

	// Normalise the account-info checkboxes (a single checkbox arrives as a string).
	// These selections drive the "other accounts held by this person" sentence in the letter
	// and the bullet-list summary row on the check answers page.
	var accountInfo = request.session.data['account-info']
	var details = accountInfo ? (Array.isArray(accountInfo) ? accountInfo : [accountInfo]) : []
	var wantsStatements = details.indexOf("Bank statements") !== -1
	var wantsOpening = details.indexOf("Opening account information, including identification documents") !== -1
	var wantsList = details.indexOf("A list of all accounts held by this account holder") !== -1

	// Normalise the holder-account-info checkboxes (the "for the account holder" question).
	// These drive the Yes/No flags used in the letter for the account itself.
	var holderAccountInfo = request.session.data['holder-account-info']
	var holderDetails = holderAccountInfo ? (Array.isArray(holderAccountInfo) ? holderAccountInfo : [holderAccountInfo]) : []
	var wantsHolderStatements = holderDetails.indexOf("Bank statements") !== -1
	var wantsHolderOpening = holderDetails.indexOf("Opening account information, including identification documents") !== -1

	var associatedAccountsText = ''
	if (wantsStatements && wantsOpening) {
		associatedAccountsText = 'Bank statements for all associated accounts held where the person is the named party from ' + (statementDateRange || 'the requested date range') + ', including account opening information, including any forms of ID provided'
	} else if (wantsStatements) {
		associatedAccountsText = 'Bank statements for all associated accounts held where the person is the named party from ' + (statementDateRange || 'the requested date range')
	} else if (wantsList && wantsOpening) {
		associatedAccountsText = 'List of all associated accounts held where the person is the named party and account opening information including any forms of ID provided'
	} else if (wantsOpening) {
		associatedAccountsText = 'Account opening information including any forms of ID provided for all associated accounts held where the person is the named party'
	} else if (wantsList) {
		associatedAccountsText = 'List of all associated accounts held where the person is the named party'
	}

	// Add current account details to the array
	var account = {
		fullName: request.session.data['fullName'],
		dob: hasDob ? ((request.session.data['dob-day'] || '') + '/' + (request.session.data['dob-month'] || '') + '/' + (request.session.data['dob-year'] || '')) : '',
		address: hasAddress ? ((request.session.data['address-line-1'] || '') + (request.session.data['address-line-2'] ? ', ' + request.session.data['address-line-2'] : '') + ', ' + (request.session.data['addressTown'] || '') + ', ' + (request.session.data['addressPostcode'] || '')) : '',
		addressLine1: request.session.data['address-line-1'],
		addressLine2: request.session.data['address-line-2'],
		addressTown: request.session.data['addressTown'],
		addressPostcode: request.session.data['addressPostcode'],
		hasAddress: !!hasAddress,
		sortCode: request.session.data['sortCode'],
		accountNo: request.session.data['accountNo'],
		cardNo: request.session.data['cardNo'],
		rollNumber: request.session.data['rollNumber'],
		openingInfo: wantsHolderOpening ? "Yes" : "No",
		bankState: wantsHolderStatements ? "Yes" : "No",
		statementDateRange: statementDateRange,
		requestedDetails: request.session.data['account-info'],
		holderAccountInfo: request.session.data['holder-account-info'],
		associatedAccountsText: associatedAccountsText,
		holderInfo: request.session.data['holder-info'],
		addressHistory: request.session.data['address-history'],
		addressHistoryDateRange: hasAddrHistDates ? ((request.session.data['addr-start-day'] || '') + '/' + (request.session.data['addr-start-month'] || '') + '/' + (request.session.data['addr-start-year'] || '') + ' to ' + (hasAddrHistEndDate ? ((request.session.data['addr-end-day'] || '') + '/' + (request.session.data['addr-end-month'] || '') + '/' + (request.session.data['addr-end-year'] || '')) : 'present')) : '',
		additionalInfo: request.session.data['withHint'],
		hasBankDetails: hasBankDetails ? true : false,

		// Raw date parts kept alongside the display strings so a "Change" from the check
		// answers page can re-populate the date inputs cleanly (see the change-account route).
		dobDay: request.session.data['dob-day'],
		dobMonth: request.session.data['dob-month'],
		dobYear: request.session.data['dob-year'],
		startDay: request.session.data['start-day'],
		startMonth: request.session.data['start-month'],
		startYear: request.session.data['start-year'],
		endDay: request.session.data['end-day'],
		endMonth: request.session.data['end-month'],
		endYear: request.session.data['end-year'],
		addrStartDay: request.session.data['addr-start-day'],
		addrStartMonth: request.session.data['addr-start-month'],
		addrStartYear: request.session.data['addr-start-year'],
		addrEndDay: request.session.data['addr-end-day'],
		addrEndMonth: request.session.data['addr-end-month'],
		addrEndYear: request.session.data['addr-end-year']
	}

	// When arriving here from a "Change" link the investigator is editing an existing
	// account, so overwrite that entry in place and return to the check answers page
	// rather than adding a new account and continuing the add-another loop.
	var editId = request.session.data['editAccountId']
	if (editId !== undefined && editId !== '' && request.session.data['accounts'][editId]) {
		request.session.data['accounts'][editId] = account
		delete request.session.data['editAccountId']
		response.redirect("check-answers")
	} else {
		request.session.data['accounts'].push(account)
		response.redirect("add-another-account")
	}
})

// "Change" links on the check answers page point here. It loads the chosen account's
// stored answers back into the flat session fields the edit pages read from, flags the
// account as being edited (editAccountId), then sends the investigator to the relevant
// page to re-walk the flow from that point. The rebuilt account overwrites the original
// when the flow reaches bank-account-request-3 again.
// The only pages a "Change" link is allowed to send the investigator to. Validating the
// requested page against this allowlist prevents an open-redirect: `page` comes from the
// query string (untrusted input) and must never be passed straight to redirect().
var CHANGE_ACCOUNT_PAGES = [
	"add-subject-financial-accounts",
	"bank-account-request",
	"bank-account-request-2",
	"bank-account-request-3"
]

router.get('/'+ version +'/investigator/change-account', function(request, response) {
	var id = request.query.id
	var page = request.query.page
	var accounts = request.session.data['accounts'] || []
	var account = accounts[id]

	// Fall back to the check answers page if the link is malformed, the account is gone,
	// or the requested page is not one of the known (allowlisted) edit pages.
	if (!account || CHANGE_ACCOUNT_PAGES.indexOf(page) === -1) {
		response.redirect("check-answers")
		return
	}

	request.session.data['editAccountId'] = id

	// Restore the flat fields the edit forms bind to, so the pages pre-fill with the
	// account's current answers (and unedited fields survive the overwrite).
	request.session.data['fullName'] = account.fullName
	request.session.data['dob-day'] = account.dobDay
	request.session.data['dob-month'] = account.dobMonth
	request.session.data['dob-year'] = account.dobYear
	request.session.data['address-line-1'] = account.addressLine1
	request.session.data['address-line-2'] = account.addressLine2
	request.session.data['addressTown'] = account.addressTown
	request.session.data['addressPostcode'] = account.addressPostcode
	request.session.data['sortCode'] = account.sortCode
	request.session.data['accountNo'] = account.accountNo
	request.session.data['cardNo'] = account.cardNo
	request.session.data['rollNumber'] = account.rollNumber
	request.session.data['account-info'] = account.requestedDetails
	request.session.data['holder-account-info'] = account.holderAccountInfo
	request.session.data['start-day'] = account.startDay
	request.session.data['start-month'] = account.startMonth
	request.session.data['start-year'] = account.startYear
	request.session.data['end-day'] = account.endDay
	request.session.data['end-month'] = account.endMonth
	request.session.data['end-year'] = account.endYear
	request.session.data['holder-info'] = account.holderInfo
	request.session.data['address-history'] = account.addressHistory
	request.session.data['addr-start-day'] = account.addrStartDay
	request.session.data['addr-start-month'] = account.addrStartMonth
	request.session.data['addr-start-year'] = account.addrStartYear
	request.session.data['addr-end-day'] = account.addrEndDay
	request.session.data['addr-end-month'] = account.addrEndMonth
	request.session.data['addr-end-year'] = account.addrEndYear
	request.session.data['withHint'] = account.additionalInfo

	// Redirect with a hardcoded string literal in every branch. The untrusted `page`
	// value is only ever used in the comparison, never passed to redirect(), so there is
	// no data flow from user input into the redirect target (no open-redirect possible).
	if (page === "add-subject-financial-accounts") {
		response.redirect("add-subject-financial-accounts")
	} else if (page === "bank-account-request") {
		response.redirect("bank-account-request")
	} else if (page === "bank-account-request-2") {
		response.redirect("bank-account-request-2")
	} else if (page === "bank-account-request-3") {
		response.redirect("bank-account-request-3")
	} else {
		response.redirect("check-answers")
	}
})

//router.post('/'+ version +'/investigator/add-request', function(request, response) {


		//response.redirect("add-another-account")

//})

router.post('/'+ version +'/investigator/add-subject-financial-loans', function(request, response) {


		response.redirect("loan-request")

})


router.post('/'+ version +'/investigator/loan-request', function(request, response) {
  response.redirect("loan-request-2")
})

router.post('/'+ version +'/investigator/loan-request-2', function(request, response) {
		response.redirect("add-another-loan")
})

router.post('/' + version + '/investigator/add-another-loan', function(request, response) {
    var addAnother = request.session.data['add-another']
    if (addAnother == "Yes") {
        delete request.session.data['loanAccount-name']
        delete request.session.data['dob-day']
        delete request.session.data['dob-month']
        delete request.session.data['dob-year']
        delete request.session.data['address-line-1']
        delete request.session.data['address-line-2']
        delete request.session.data['addressTown']
        delete request.session.data['addressPostcode']
        delete request.session.data['accountNo']
        delete request.session.data['bank-state']
        delete request.session.data['bank-start-day']
        delete request.session.data['bank-start-month']
        delete request.session.data['bank-start-year']
        delete request.session.data['bank-end-day']
        delete request.session.data['bank-end-month']
        delete request.session.data['bank-end-year']
        delete request.session.data['account-info']
        delete request.session.data['loan-info']
        delete request.session.data['holder-info']
        delete request.session.data['address-history']
        delete request.session.data['addr-start-day']
        delete request.session.data['addr-start-month']
        delete request.session.data['addr-start-year']
        delete request.session.data['addr-end-day']
        delete request.session.data['addr-end-month']
        delete request.session.data['addr-end-year']
        delete request.session.data['additional-loan-info']
        delete request.session.data['add-another']
        response.redirect("add-subject-financial-loans")
    } else {
        response.redirect("check-answers-loan")
    }
})

router.post('/'+ version +'/investigator/add-subject-financial-transaction', function(request, response) {


		response.redirect("add-another-transaction")

})

router.post('/' + version + '/investigator/add-another-transaction', function(request, response) {

    var addAnother = request.session.data['add-another']

    if (addAnother == "Yes") {
        // Clear transaction-specific data
        delete request.session.data['transaction-day']
        delete request.session.data['transaction-month']
        delete request.session.data['transaction-year']
        delete request.session.data['payment-amount']
        delete request.session.data['creditType']
        delete request.session.data['pay-ref']
        delete request.session.data['sortCode']
        delete request.session.data['accountNo']
        delete request.session.data['add-another']

        response.redirect("add-subject-financial-transaction")
    } else {
        response.redirect("check-answers-transaction")
    }

})

//router.post('/'+ version +'/investigator/add-another-account', function(request, response) {


		//response.redirect("check-answers")

//})

router.post('/' + version + '/investigator/add-another-account', function(request, response) {

    var addAnother = request.session.data['add-another']
    var requestType = request.session.data['requestType']

    if (addAnother == "Yes") {
        // The account just entered has already been saved to the accounts array in the
        // bank-account-request-3 step, so here we only clear the per-account fields so
        // the next iteration starts from a clean set of forms.
        delete request.session.data['fullName']
        delete request.session.data['dob-day']
        delete request.session.data['dob-month']
        delete request.session.data['dob-year']
        delete request.session.data['address-line-1']
        delete request.session.data['address-line-2']
        delete request.session.data['addressTown']
        delete request.session.data['addressPostcode']
        delete request.session.data['sortCode']
        delete request.session.data['accountNo']
        delete request.session.data['cardNo']
        delete request.session.data['account-info']
        delete request.session.data['editAccountId']
        delete request.session.data['opening-info']
        delete request.session.data['bank-state']
        delete request.session.data['add-another']
        delete request.session.data['holder-dets']
        delete request.session.data['rollNumber']
        delete request.session.data['start-day']
        delete request.session.data['start-month']
        delete request.session.data['start-year']
        delete request.session.data['end-day']
        delete request.session.data['end-month']
        delete request.session.data['end-year']
        delete request.session.data['holder-info']
        delete request.session.data['address-history']
        delete request.session.data['addr-start-day']
        delete request.session.data['addr-start-month']
        delete request.session.data['addr-start-year']
        delete request.session.data['addr-end-day']
        delete request.session.data['addr-end-month']
        delete request.session.data['addr-end-year']
        delete request.session.data['withHint']
        delete request.session.data['contact']
        delete request.session.data['sah-day']
        delete request.session.data['sah-month']
        delete request.session.data['sah-year']
        delete request.session.data['eah-day']
        delete request.session.data['eah-month']
        delete request.session.data['eah-year']
        delete request.session.data['loanAccount-name']
        delete request.session.data['transaction-day']
        delete request.session.data['transaction-month']
        delete request.session.data['transaction-year']
        delete request.session.data['payment-amount']
        delete request.session.data['creditType']
        delete request.session.data['pay-ref']

        if (requestType == "Loans and mortgages") {
            response.redirect("add-subject-financial-loans")
        } else if (requestType == "Specific transaction details") {
            response.redirect("add-subject-financial-transaction")
        } else {
            response.redirect("add-subject-financial-accounts")
        }
    } else {
        if (requestType == "Specific transaction details") {
            response.redirect("check-answers-transaction")
        } else if (requestType == "Loans and mortgages") {
            response.redirect("check-answers-loan")
        } else {
            response.redirect("check-answers")
        }
    }

})


router.post('/' + version + '/investigator/remove-account', function(request, response) {
    var removeAccount = request.session.data['remove-account']
    var id = request.session.data['id']

    if (removeAccount == 'Yes') {
        request.session.data['accounts'].splice(id, 1)
    }

    response.redirect("check-answers")
})

router.post('/'+ version +'/investigator/check-answers', function(request, response) {


		response.redirect("review-request")

})

router.post('/'+ version +'/investigator/review-request', function(request, response) {


		response.redirect("declaration")

})

router.post('/'+ version +'/investigator/declaration', function(request, response) {


		response.redirect("rfi-dashboard")

})

router.post('/'+ version +'/investigator/check-answers-transaction', function(request, response) {


		response.redirect("review-request-transaction")

})

router.post('/'+ version +'/investigator/check-answers-loan', function(request, response) {


		response.redirect("review-request-loan")

})

router.post('/'+ version +'/investigator/review-request-loan', function(request, response) {


		response.redirect("declaration")

})

router.post('/'+ version +'/investigator/review-request-transaction', function(request, response) {


		response.redirect("declaration")

})

router.post('/'+ version +'/investigator/add-subject-other', function(request, response) {


		response.redirect("other-request")

})

router.post('/'+ version +'/investigator/other-request', function(request, response) {


		response.redirect("add-another-subject")

})

router.post('/' + version + '/investigator/add-another-subject', function(request, response) {
    var addAnother = request.session.data['add-another']
    if (addAnother == "Yes") {
        delete request.session.data['fullName']
        delete request.session.data['dob-day']
        delete request.session.data['dob-month']
        delete request.session.data['dob-year']
        delete request.session.data['address-line-1']
        delete request.session.data['address-line-2']
        delete request.session.data['addressTown']
        delete request.session.data['addressPostcode']
        delete request.session.data['withHint']
        delete request.session.data['add-another']
        response.redirect("add-subject-other")
    } else {
        response.redirect("check-answers-other")
    }
})

router.post('/'+ version +'/investigator/check-answers-other', function(request, response) {


		response.redirect("review-request-other")

})

router.post('/'+ version +'/investigator/review-request-other', function(request, response) {


		response.redirect("declaration")

})

router.post('/'+ version +'/investigator/add-subject-employment', function(request, response) {


		response.redirect("select-eq1")

})
router.post('/'+ version +'/investigator/select-eq1', function(request, response) {


		response.redirect("check-answers-employment")

})
