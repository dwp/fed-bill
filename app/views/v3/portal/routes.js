//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

var version = "v3";


router.post('/'+ version +'/portal/enter-ref', function(request, response) {


		response.redirect("enter-access-code")

})

router.post('/'+ version +'/portal/enter-access-code', function(request, response) {


		response.redirect("how-to-respond")

})

router.post('/'+ version +'/portal/how-to-respond', function(request, response) {

	// The "How do you want to respond?" question is rendered as checkboxes, so a single
	// selection arrives as a string and multiple selections arrive as an array. Normalise
	// to an array so the values (which come from the checkbox "value" attributes, not the
	// visible labels) can be checked consistently.
	var respondType = request.session.data['respondType']
	var selectedTypes = respondType ? (Array.isArray(respondType) ? respondType : [respondType]) : []

	if (selectedTypes.indexOf("Upload files") !== -1){
		response.redirect("upload-files")
	}
	else if (selectedTypes.indexOf("Free Text") !== -1){
		response.redirect("free-text-response")
	}
	else if (selectedTypes.indexOf("none") !== -1){
		// "I can not respond to this request" - there is no dedicated page for this yet,
		// so send the investigator back to the start of the portal journey.
		response.redirect("can-not-respond")
	}
	else {
		// Nothing selected - stay on the same page rather than redirecting to a page
		// that doesn't exist.
		response.redirect("how-to-respond")
	}
})

router.post('/'+ version +'/portal/upload-files', function(request, response) {

	// The actual selected files (name + a human-readable size) are captured client-side
	// (see application.js) and sent here as a JSON string in `selectedFiles`, since the
	// prototype kit does not handle real multipart file uploads. Parse them and append
	// to the running list of files the investigator has added, so the "Files added" page
	// can show what was genuinely selected instead of placeholder data.
	var selectedFiles = []
	try {
		selectedFiles = JSON.parse(request.session.data['selectedFiles'] || '[]')
	} catch (e) {
		selectedFiles = []
	}

	if (!request.session.data['uploadedFiles']) {
		request.session.data['uploadedFiles'] = []
	}
	request.session.data['uploadedFiles'] = request.session.data['uploadedFiles'].concat(selectedFiles)

	delete request.session.data['selectedFiles']

	// upload-files.html now shows the uploaded file(s), the running file list and (where
	// relevant) the free-text response all on a single combined page, so uploading a file
	// simply re-renders that same page rather than moving on to a separate page.
	response.redirect("upload-files")

})

router.get('/'+ version +'/portal/remove-file', function(request, response) {
	var id = request.query.id
	var uploadedFiles = request.session.data['uploadedFiles'] || []

	if (id !== undefined && uploadedFiles[id]) {
		uploadedFiles.splice(id, 1)
	}

	response.redirect("upload-files")
})

router.post('/'+ version +'/portal/free-text-response', function(request, response) {


		response.redirect("ask-for-email")

})

// "Continue" on the combined upload-files.html page - submits the free-text response
// (if the investigator also chose to send free text) and moves on to confirmation.
router.post('/'+ version +'/portal/send-response', function(request, response) {

  response.redirect("free-text-response")

})

router.post('/'+ version +'/portal/upload-files', function(request, response) {


  response.redirect("free-text-response")

})

router.post('/'+ version +'/portal/add-email', function(request, response) {


		response.redirect("check-your-answers")

})
router.post('/'+ version +'/portal/can-not-respond', function(request, response) {


  response.redirect("confirmation-no-response")

})

router.post('/'+ version +'/portal/ask-for-email', function(request, response) {


  var addEmail = request.session.data['addEmail']
  if (addEmail == "Yes"){
    response.redirect ("/v3/portal/add-email")
  }
  else if (addEmail == "No"){
    response.redirect("check-your-answers")
  }
  else {
    response.redirect("ask-for-email-error")
  }
})


router.post('/'+ version +'/portal/check-your-answers', function(request, response) {


  response.redirect("confirmation-email-sent")

})



