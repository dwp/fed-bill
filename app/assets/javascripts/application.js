//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

  // v3 portal - "Upload files" page: show the names (and sizes) of the files the
  // user has actually selected, and pass that information to the server (as JSON
  // in a hidden field) so the "Files added" page can list the real files rather
  // than placeholder data.
  // Note: GOV.UK Frontend's file-upload component renames the input's `id` to
  // `file-upload-1-input` when it enhances the drop-zone, so look it up by its
  // (unchanged) `name` attribute instead - otherwise this would fail to find the
  // input once the page has loaded.
  var fileUploadInput = document.querySelector('input[name="file-upload-1"]')
  var selectedFilesList = document.getElementById('selected-files-list')
  var selectedFilesData = document.getElementById('selected-files-data')

  if (fileUploadInput && selectedFilesList && selectedFilesData) {
    var uploadForm = fileUploadInput.form
    var uploadSubmitButton = uploadForm ? uploadForm.querySelector('button[type="submit"]') : null

    var formatFileSize = function (bytes) {
      if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
      }
      return Math.max(1, Math.round(bytes / 1024)) + ' KB'
    }

    var updateSelectedFiles = function () {
      var files = Array.prototype.slice.call(fileUploadInput.files || [])

      selectedFilesList.innerHTML = ''
      files.forEach(function (file) {
        var item = document.createElement('li')
        item.textContent = file.name + ' (' + formatFileSize(file.size) + ')'
        selectedFilesList.appendChild(item)
      })

      selectedFilesData.value = JSON.stringify(files.map(function (file) {
        return { name: file.name, size: formatFileSize(file.size) }
      }))

      // Submit the form automatically as soon as file(s) are chosen, so the "Files
      // added" table updates straight away without the user having to press the
      // "Upload file"/"Upload another file" button.
      if (files.length > 0 && uploadForm) {
        uploadForm.submit()
      }
    }

    fileUploadInput.addEventListener('change', updateSelectedFiles)

    // The upload is now triggered automatically on file selection, so the submit
    // button is only needed as a fallback for browsers with JavaScript disabled.
    if (uploadSubmitButton) {
      uploadSubmitButton.classList.add('govuk-visually-hidden')
    }
  }
})
