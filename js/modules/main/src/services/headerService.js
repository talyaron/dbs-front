angular.module('main').
	factory('header', [function() {
		var _sub_header_state = 'closed';

		var header = {
			get sub_header_state() {
				return _sub_header_state;
			},

			set sub_header_state(new_state) {
				var old_state = _sub_header_state;
console.log(old_state)
console.log(new_state)
		        if (old_state == new_state) {
		            _sub_header_state = 'closed';
		        }
		        else {
		            _sub_header_state = new_state;
				}
			}
		}

		return header
	}]);