"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FirebaseFileUploader = function () {
	function FirebaseFileUploader() {
		_classCallCheck(this, FirebaseFileUploader);
	}

	_createClass(FirebaseFileUploader, [{
		key: "process",
		value: function process(files, ref) {
			var single = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

			if (!files || !files.length) return;

			var processed = [];

			var _loop = function _loop(i) {
				processed.push(new Promise(function (resolve) {
					var reader = new FileReader();
					reader.onload = function (e) {
						resolve({
							name: files[i].name,
							size: files[i].size,
							type: files[i].type,
							src: e.target.result
						});
					};
					reader.readAsDataURL(files[i]);
				}));
			};

			for (var i = 0; i < files.length; i++) {
				_loop(i);
			}

			return Promise.all(processed).then(function (files) {
				if (ref) {
					if (ref instanceof Firebase) {
						if (single) {
							return ref.set(files[0] || null);
						} else {
							var deferreds = [];
							files.map(function (file) {
								return deferreds.push(ref.push(file));
							});
							return Promise.all(deferreds);
						}
					} else {
						if (single) {
							for (var k in files[0]) {
								ref[k] = files[0][k];
							}return ref;
						} else {
							files.map(function (file) {
								return ref.push(file);
							});
							return ref;
						}
					}
				} else {
					return files;
				}
			});
		}
	}]);

	return FirebaseFileUploader;
}();

//# sourceMappingURL=firebase-file-uploader.js.map