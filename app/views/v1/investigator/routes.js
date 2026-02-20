//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

var version = "v1";
router.post('/'+ version +'/investigator/add-category', function(request, response) {


	var categoryType = request.session.data['categoryType']
	if (categoryType == "financial"){
		response.redirect ("add-subject-financial")
	} else {
		response.redirect("add-subject")
	}
})

//router.post('/'+ version +'/investigator/start-request-for-info', function(request, response) {

	
		//response.redirect("add-providor")

//})
	
router.post('/'+ version +'/investigator/add-benefit', function(request, response) {

	
		response.redirect("add-providor")
	
})

router.post('/'+ version +'/investigator/add-providor', function(request, response) {

	
		response.redirect("add-category")
	
})