class FirebaseImageUploader {
	constructor(ref) {
		if ( ! (ref instanceof Firebase)) throw new Error('Firebase reference required');

		this.ref = ref;
	}
	upload(files, single = false) {
		for(let i = 0; i < files.length; i++) {
			let reader = new FileReader();
			reader.onload = e => this.ref[single ? 'set' : 'push'](e.target.result);
			reader.readAsDataURL(files[i]);
			
			if (single) break;
		}
	}
}