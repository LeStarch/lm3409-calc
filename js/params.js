function Params(prms,chg) {
    var _self = this;

    _self.params = prms;
    _self.change = chg;
    
    _self.setup =
        /**
         * Setup all parameters by setting their values
         */
        function() {
            //Loops across all parameters
            for (var key in _self.params) {
                try {
                    if (_self.params[key].func !== undefined) {
                        _self.set(key,_self.params[key].func(_self),false);
                        continue;
                    }
                } catch (err) {
                    if (err.constructor !== NotSetException)
                        throw err;
                }
                if (_self.params[key].guess !== undefined){
                    _self.set(key,_self.params[key].guess,false);
                }
            }
        };
    
    _self.get =
        /**
         * Get a parameter
         * @param name - name of parameter to get
         * @return value of parameter (value first, then function, then guess)
         */
        function(name) {
        console.log("Name:"+name);
            //If unset, throw unset
            if (_self.params[name].value === undefined)
                throw new NotSetException(name);
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
            console.log("Name:"+name+" Value:"+value);
            
            //Is it not from a user and a proper value is set, then break
            if (value == "" || (!user && _self.params[name].input) || Math.abs(parseFloat(value) - _self.params[name].value) < 0.000001)
                return;
            value = parseFloat(value);
            //Set and update
            _self.params[name].value = value;
            //_self.params[name].input = user;
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
    _self.setup();
}
function NotSetException(name) {
    this.name = name;
}