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


		response.redirect("bank-account-request-2")

})

router.post('/'+ version +'/investigator/bank-account-request-2', function(request, response) {


		response.redirect("bank-account-request-3")

})

router.post('/'+ version +'/investigator/bank-account-request-3', function(request, response) {

    // Initialize accounts array if it doesn't exist
    if (!request.session.data['accounts']) {
        request.session.data['accounts'] = []
    }

    // Add current account details to the array
    var account = {
        fullName: request.session.data['fullName'],
        dob: (request.session.data['dob-day'] || '') + '/' + (request.session.data['dob-month'] || '') + '/' + (request.session.data['dob-year'] || ''),
        address: (request.session.data['address-line-1'] || '') + (request.session.data['address-line-2'] ? ', ' + request.session.data['address-line-2'] : '') + ', ' + (request.session.data['addressTown'] || '') + ', ' + (request.session.data['addressPostcode'] || ''),
        sortCode: request.session.data['sortCode'],
        accountNo: request.session.data['accountNo'],
        cardNo: request.session.data['cardNo'],
        openingInfo: request.session.data['opening-info'],
        bankState: request.session.data['bank-state']
    }

    request.session.data['accounts'].push(account)

    response.redirect("add-another-account")

})

//router.post('/'+ version +'/investigator/add-request', function(request, response) {


		//response.redirect("add-another-account")

//})

router.post('/'+ version +'/investigator/add-subject-financial-loans', function(request, response) {


		response.redirect("loan-request")

})

router.post('/'+ version +'/investigator/loan-request', function(request, response) {


		response.redirect("add-another-account")

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
