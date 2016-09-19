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
	resize(img, maxWidth, maxHeight, rotateDegrees) {
		var imgWidth = img.width,
			imgHeight = img.height,
			ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight), // Use the smallest ratio that the image best fit into the maxWidth x maxHeight box.
			canvas = document.createElement('canvas'),
			canvasCopy = document.createElement('canvas'),
			canvasCopy2 = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			copyCtx = canvasCopy.getContext('2d'),
			copyCtx2 = canvasCopy2.getContext('2d');

		// init
		canvasCopy.width = canvasCopy2.width = imgWidth;
		canvasCopy.height = canvasCopy2.height = imgHeight;
		copyCtx.drawImage(img, 0, 0);
		copyCtx2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

		var rounds = 2,
			roundRatio = ratio * rounds;
		for (var i = 1; i <= rounds; i++) {
			// tmp
			canvasCopy.width = imgWidth * roundRatio / i;
			canvasCopy.height = imgHeight * roundRatio / i;
			copyCtx.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);

			// copy back
			canvasCopy2.width = imgWidth * roundRatio / i;
			canvasCopy2.height = imgHeight * roundRatio / i;
			copyCtx2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
		}

		canvas.width = imgWidth * roundRatio / rounds;
		canvas.height = imgHeight * roundRatio / rounds;
		ctx.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height);

		if (rotateDegrees) {
			if (rotateDegrees == 90 || rotateDegrees == 270) {
				canvas.width = canvasCopy2.height;
				canvas.height = canvasCopy2.width;
			} else {
				canvas.width = canvasCopy2.width;
				canvas.height = canvasCopy2.height;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (rotateDegrees == 90 || rotateDegrees == 270) {
				ctx.translate(canvasCopy2.height / 2, canvasCopy2.width / 2);
			} else {
				ctx.translate(canvasCopy2.width / 2, canvasCopy2.height / 2);
			}
			ctx.rotate(rotateDegrees * Math.PI / 180);
			ctx.drawImage(canvasCopy2, -canvasCopy2.width / 2, -canvasCopy2.height / 2);
		}

		return canvas.toDataURL();
	}
}