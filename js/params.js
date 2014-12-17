function Params(prms,chg) {
    var _self = this;

    _self.params = prms;
    _self.change = chg;
    _self.getting = [];
    _self.get =
        /**
         * Get a parameter
         * @param name - name of parameter to get
         * @return value of parameter (value first, then function, then guess)
         */
        function(name) {
            for (var i = 0; i < _self.getting.length; i++) {
                if (_self.getting[i] == name)
                    throw new NotSetException(name); 
            }
            _self.getting.push(name);
            try {
                if (_self.params[name].value === undefined) {
                    if (_self.params[name].func !== undefined) {
                        _self.set(name,_self.params[name].func(_self),false);
                    } else if (_self.params[name].guess !== undefined){
                        _self.set(name,_self.params[name].guess,false);
                    } else {
                        throw new NotSetException(name);
                    }
                }
            } finally {
                _self.getting.pop();
            }
            return _self.params[name].value;
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
            if ( !user && _self.params[name].input)
                return;
            //Set and update
            _self.params[name].value = value;
            _self.change(name,value);
            for (var key in _self.params)
            {
                var deps = _self.params[key].depends;
                for (var i = 0; i < deps.length; i++) {
                    if (name == deps[i]) {
                        try {
                            _self.set(key,_self.params[key].func(_self),false);
                        } catch (err) {
                            if (err.constructor !== NotSetException)
                                throw err;
                        }
                    }
                }
            }
        }
}
function NotSetException(name) {
    this.name = name;
}