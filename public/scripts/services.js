angular.module('intraX.services', [])
.factory("SessionService", function() {
	return {
		get: function(key) {
      var val = sessionStorage.getItem(key);
      if (!val)
        return;
      var i = val.indexOf("_serialized:");
      if (i !== -1)
        val = val.substr(12, val.length - 12);
      return angular.fromJson(val);
		},
		set: function(key, val) {
      if (typeof(val) === "object" || typeof(val) === "array") {
        val = "_serialized:" + angular.toJson(val);
      }
      return sessionStorage.setItem(key, val);
		},
		unset: function(key) {
			return sessionStorage.removeItem(key);
		}
	}
});
