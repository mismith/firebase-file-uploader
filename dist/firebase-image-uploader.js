'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FirebaseImageUploader = function () {
	function FirebaseImageUploader(ref) {
		_classCallCheck(this, FirebaseImageUploader);

		if (!(ref instanceof Firebase)) throw new Error('Firebase reference required');

		this.ref = ref;
	}

	_createClass(FirebaseImageUploader, [{
		key: 'upload',
		value: function upload(files) {
			var _this = this;

			var single = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			for (var i = 0; i < files.length; i++) {
				var reader = new FileReader();
				reader.onload = function (e) {
					return _this.ref[single ? 'set' : 'push'](e.target.result);
				};
				reader.readAsDataURL(files[i]);

				if (single) break;
			}
		}
	}]);

	return FirebaseImageUploader;
}();

//# sourceMappingURL=firebase-image-uploader.js.map