class FirebaseFileUploader {
	process(files, ref, single = false) {
		if ( ! files || ! files.length) return;

		var processed = [];

		for(let i = 0; i < files.length; i++) {
			processed.push(new Promise(resolve => {
				let reader = new FileReader();
				reader.onload = e => {
					resolve({
						name: files[i].name,
						size: files[i].size,
						type: files[i].type,
						src: e.target.result,
					});
				};
				reader.readAsDataURL(files[i]);
			}));
		}

		return Promise.all(processed).then(files => {
			if (ref) {
				if (single) {
					return ref.set(files[0] || null);
				} else {
					var deferreds = [];
					files.map(file => deferreds.push(ref.push(file)));
					return Promise.all(deferreds);
				}
			} else {
				return files;
			}
		});
	}
}