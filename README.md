# FirebaseImageUploader

Use HTML5/modern browsers to store image data processed client-side as base64-encoded data in Firebase


## Usage

	var ref = new Firebase(FB_URL + '/images');
	var firebaseImageUploader = new FirebaseImageUploader(ref);

	document.querySelector('[type=file]').addEventListener('change', function () {
		firebaseImageUploader.upload(this.files); 
	});