class FirebaseFileUploader {
	process(files, ref, single = false) {
		if ( ! files || ! files.length) return;

		let processed = [];

		for(let i = 0; i < files.length; i++) {
			processed.push(new Promise(resolve => {
				let reader = new FileReader();
				if (files[i] instanceof DataTransferItem) {
					reader.onload = e => {
						resolve({
							src: e.target.result,
						});
					};
					let blob = files[i].getAsFile();
					if (blob instanceof Blob) {
						reader.readAsDataURL(blob);
					} else {
						// @TODO: error?
					}
				} else if (files[i] instanceof File) {
					reader.onload = e => {
						resolve({
							name: files[i].name,
							size: files[i].size,
							type: files[i].type,
							src: e.target.result,
						});
					};
					reader.readAsDataURL(files[i]);
				}
			}));
		}

		return Promise.all(processed).then(files => {
			if (ref) {
				if (ref instanceof Firebase) {
					// firebase reference
					if (single) {
						return ref.set(files[0] || null).then(snap => files);
					} else {
						let deferreds = [];
						files.map(file => deferreds.push(ref.push(file)));
						return Promise.all(deferreds).then(files);
					}
				} else {
					// object / array (i.e. for local/draft manipulation)
					if (single) {
						for(let k in files[0]) ref[k] = files[0][k];
						return ref;
					} else {
						files.map(file => ref.push(file));
						return ref;
					}
				}
			} else {
				return files;
			}
		});
	}
}