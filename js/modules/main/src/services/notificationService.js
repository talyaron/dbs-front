angular.module('main').
	factory('notification', function(langManager) {

	var DEFAULT_OPTIONS = {
			'className': 'info',
			globalPosition: 'top center'
		},
	    pendingOptions = {
			 autoHide: false,
			 showDuration: 50
		},
		errorOptions = {
			 className: 'error',
			 showDuration: 10
		},
		warnOptions = {
			 className: 'warn'
		},
		messages = {
500: {
	en: 'Sorry, but the Server is down. Please try again later',
	he: 'צטערת, השרת נפל. אנא נסה שנית מאוחר יותר.',
	options: errorOptions
}, 0: {
	en: 'all is fine',
	he: 'הכל אחלה',
	options: pendingOptions
}, 1: {
	en: "A message with your login link has been emailed to you",
	he: 'הודעת דואל עם הקישור לכניסה נשלחה אליך'
}, 2: {
	en: 'found some people in the family trees',
	he: 'מצטתי אנשים בעצי המשפחהן',
}, 3: {
	en: "Sorry, didn't find any person",
	he: 'מצטערים, לא מצאתי אנשים',
	options: errorOptions
}, 4: {
	en: 'Loading item...',
	he: 'טוען פריט...',
	options: pendingOptions
}, 5: {
	en: 'Sorry, failed to fetch item',
	he: 'מצטערים, טעינת פריט נכשלה'
}, 6: {
	en: 'Loading Story...',
	he: 'טוען את הסיפור...'
}, 7: {
	en: 'Item removed',
	he: 'הפריט הוסר'
}, 8: {
	en: 'Failed to remove item',
	he: 'הסרת הפריט נכשלה'
}, 9: {
	en: 'Upload in progress...',
	he: 'העלאה מתבצעת...'
}, 10: {
	en: 'Sending the login email has failed, please try again later.',
	he: 'שליחת דואל הכניסה נשלחה, אנא נסו שוב בעוד מספר רגעים',
	options: errorOptions
}, 11: {
	en: 'Search has failed.',
	he: 'החיפוש נכשל.',
	options: errorOptions
}, 12: {
	en: 'We have not found a surname or a community to match your search',
	he: 'לא מצאנו את שם המשפחה או הקהילה שחיפשתם',
	options: {
	  className: 'error',
	  autoHide: false,
	  showDuration: 10
	  }
}, 13: {
	en: 'Sorry, we failed to find a community to match your search',
	he: 'לא מצאנו את הקהילה שחיפשתם',
	options: warnOptions
}, 14: {
	en: 'Sorry, we failed to find a family name to match your search',
	he: 'לא מצאנו את שם המפשחה שחיפשתם',
	options: warnOptions

}
// next line ends the notifications dict
	},
	message = {
			en: '',
			he: ''
		}

		var notification = {
			loading_gif: null,
			loading: function(on) {
				var view = angular.element(document.getElementById('view'));
				if (on) {
					view.addClass('backdrop');
					this.loading_gif = jQuery('<img>')
						.addClass('loading')
						.attr('src', 'images/BH-Loading.gif')
						.appendTo('body');
				} else if (this.loading_gif) {
					view.removeClass('backdrop');
					this.loading_gif.remove();
					this.loading_gif == null;
				}
			},
			put: function(msg_id) {
				message = messages[msg_id];
				var options = angular.extend({}, DEFAULT_OPTIONS, message.options),
					text = message[langManager.lang];
				jQuery.notify(text, options);
			},

			add: function(new_message) {
				message.en += ' ' + new_message.en;
				message.he += ' ' + new_message.he;
			},

			clear: function() {
				jQuery('.notifyjs-hidable').trigger('notify-hide');
			},
		};

		return notification;
	});
