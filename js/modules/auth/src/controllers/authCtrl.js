var AuthCtrl = function($rootScope, $modalInstance, langManager, auth) {
    var self = this;

    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.auth = auth;

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	}
    });

    // user name
    this.iare = '';

    // password
    this.ias = '';

    // auth message to display to the user
    this.message = '';
}

AuthCtrl.prototype = {

    signin: function() {
        var self = this;

    	this.auth.signin(this.iare, this.ias).
            then(function() {    
                self.message = 'Sign in succeeded';
                self.$rootScope.$broadcast('signin');
                self.$modalInstance.close();
            }, function() {
                self.message = 'Sign in failed';
            });
    },

    dismiss: function() {
        this.$modalInstance.dismiss();
    }
}

angular.module('auth').controller('AuthCtrl', ['$rootScope', '$modalInstance', 'langManager', 'auth', '$http', AuthCtrl]);
