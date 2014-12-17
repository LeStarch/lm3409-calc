function Params() {
    var _self = this;

    _self.params = CONFIG.params;
    
    _self.get =
        /**
         * Get a parameter
         * @param name - name of parameter to get
         * @return value of parameter (value first, then function, then guess)
         */
        function(name) {
            if (_self.params[name].value !== undefined)
                return _self.params[name].value;
            return _self.params[name].func(_self);
            if (_self.params[name].guess !== undefined) 
                return _self.params[name].guess;
            throw new Exception("Parameter: "+name+" must be set.");
        }
    _self.set =
        /**
         * Set a parameter
         * @param name - name of parameter to get
         * @param value - value of parameter to get
         * @param user - true if forced from user, false otherwise
         */
        function(name,value,user) {
            //Is it not from a user and a proper value is set, then break
            if ( !user && _self.params[name].value !== undefined)
                return;
            //Set and update
            _self.params[name].value = value;
            for (var key in _self.params)
            {
                var deps = _self.params[key].depends;
                for (var i = 0; i < deps.size(); i++) {
                    if (name == deps[i]) {
                        _self.set(key,_self.params[key].func(_self),false);
                    }
                }
            }
        }
}