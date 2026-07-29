//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

var version = "v2";


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

	// Only ask for a statement date range when statements have actually been requested,
	// either via the "Do you want bank statements for this account?" radio or the
	// "All accounts bank statements" checkbox.
	var wantsStatements = request.session.data['bank-state'] == "Yes" || details.indexOf("All accounts bank statements") !== -1

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
		response.redirect("add-another-account")
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
        // Clear account-specific data for next entry
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
        // Initialize accounts array if it doesn't exist
        if (!request.session.data['accounts']) {
            request.session.data['accounts'] = []
        }

        // Work out which details the user actually entered so the summary only shows those
        var hasDob = request.session.data['dob-day'] || request.session.data['dob-month'] || request.session.data['dob-year']
        var hasAddress = request.session.data['address-line-1'] || request.session.data['address-line-2'] || request.session.data['addressTown'] || request.session.data['addressPostcode']
        var hasBankDetails = request.session.data['sortCode'] || request.session.data['accountNo'] || request.session.data['cardNo'] || request.session.data['rollNumber']
        var hasStatementDates = request.session.data['start-day'] || request.session.data['start-month'] || request.session.data['start-year']
        var hasEndDate = request.session.data['end-day'] || request.session.data['end-month'] || request.session.data['end-year']
        var hasTransactionDates = request.session.data['bank-start-day'] || request.session.data['bank-start-month'] || request.session.data['bank-start-year']
        var hasTransactionEndDate = request.session.data['bank-end-day'] || request.session.data['bank-end-month'] || request.session.data['bank-end-year']
        var hasAddrHistDates = request.session.data['addr-start-day'] || request.session.data['addr-start-month'] || request.session.data['addr-start-year']
        var hasAddrHistEndDate = request.session.data['addr-end-day'] || request.session.data['addr-end-month'] || request.session.data['addr-end-year']

        // A blank statement end date means "up to today", so populate it with today's date
        var todayDate = new Date()
        var today = todayDate.getDate() + '/' + (todayDate.getMonth() + 1) + '/' + todayDate.getFullYear()
        var statementDateRange = hasStatementDates ? ((request.session.data['start-day'] || '') + '/' + (request.session.data['start-month'] || '') + '/' + (request.session.data['start-year'] || '') + ' to ' + (hasEndDate ? ((request.session.data['end-day'] || '') + '/' + (request.session.data['end-month'] || '') + '/' + (request.session.data['end-year'] || '')) : today)) : ''

        // Build the "other accounts held by this person" sentence for the letter.
        // The 3 checkboxes combine into one ordered statement; a bank-statement selection
        // absorbs the plain "list" selection (matches the V5 design combinations).
        var accountInfo = request.session.data['account-info']
        var details = accountInfo ? (Array.isArray(accountInfo) ? accountInfo : [accountInfo]) : []
        var wantsList = details.indexOf("List of all account details") !== -1
        var wantsBankAll = details.indexOf("All accounts bank statements") !== -1
        var wantsOpenAll = details.indexOf("All opening account information including ID") !== -1
        var associatedAccountsText = ''
        if (wantsBankAll && wantsOpenAll) {
            associatedAccountsText = 'Bank statements for all associated accounts held where the person is the named party from ' + (statementDateRange || 'the requested date range') + ', including account opening information, including any forms of ID provided'
        } else if (wantsBankAll) {
            associatedAccountsText = 'Bank statements for all associated accounts held where the person is the named party from ' + (statementDateRange || 'the requested date range')
        } else if (wantsList && wantsOpenAll) {
            associatedAccountsText = 'List of all associated accounts held where the person is the named party and account opening information including any forms of ID provided'
        } else if (wantsOpenAll) {
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
            openingInfo: request.session.data['opening-info'],
            bankState: request.session.data['bank-state'],
            statementDateRange: statementDateRange,
            transactionBalances: request.session.data['bank-state'],
            transactionDateRange: hasTransactionDates ? ((request.session.data['bank-start-day'] || '') + '/' + (request.session.data['bank-start-month'] || '') + '/' + (request.session.data['bank-start-year'] || '') + ' to ' + (hasTransactionEndDate ? ((request.session.data['bank-end-day'] || '') + '/' + (request.session.data['bank-end-month'] || '') + '/' + (request.session.data['bank-end-year'] || '')) : 'present')) : '',
            requestedDetails: request.session.data['account-info'],
            associatedAccountsText: associatedAccountsText,
            loanInfo: request.session.data['loan-info'],
            holderInfo: request.session.data['holder-info'],
            addressHistory: request.session.data['address-history'],
            addressHistoryDateRange: hasAddrHistDates ? ((request.session.data['addr-start-day'] || '') + '/' + (request.session.data['addr-start-month'] || '') + '/' + (request.session.data['addr-start-year'] || '') + ' to ' + (hasAddrHistEndDate ? ((request.session.data['addr-end-day'] || '') + '/' + (request.session.data['addr-end-month'] || '') + '/' + (request.session.data['addr-end-year'] || '')) : 'present')) : '',
            additionalInfo: request.session.data['withHint'],
            hasBankDetails: hasBankDetails ? true : false
        }

        request.session.data['accounts'].push(account)

        if (requestType == "Specific transaction details"){
            response.redirect("check-answers-transaction")
        }
        else if (requestType == "Loans and mortgages"){
            response.redirect("check-answers-loan")
        }
        else {
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
