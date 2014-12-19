function Params(prms,chg,lck) {
    var _self = this;

    _self.params = prms;
    _self.change = chg;
    _self.lock = lck;
    _self.getting = [];
    
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
            //If you are getting something already looked for, lock it
            for (var i = 0; i < _self.getting.length; i++) 
            {
                //Lock it
                if (name == _self.getting[i] && _self.params[name].usable == true)
                {
                    _self.params[name].input = true;
                    _self.lock(name);
                    break;
                }
            }
            //
            var locked = _self.params[name].input;
            var value = _self.params[name].value;
            var func = _self.params[name].func;
            var guess = _self.params[name].guess;
            //Locked
            if (locked) {
                if (value !== undefined)
                    return value;
                throw new NotSetException(name);
            } else {
                try {
                    _self.getting.push(name);
                    if (_self.params[name].func !== undefined)
                        return _self.params[name].func(_self);
                } catch (err) {
                    if (err.constructor !== NotSetException)
                        throw err;
                } finally {
                    _self.getting.pop();
                }
                if (guess !== undefined)
                    return guess;
                throw new NotSetException(name);
            }
        }
    _self.set =
        /**
         * Set a parameter
         * @param name - name of parameter to get
         * @param value - value of parameter to get
         * @param user - true if forced from user, false otherwise
         */
        function(name,value) {
            //Is it not from a user and a proper value is set, then break
            value = parseFloat(value);
            if (isNaN(value))
                return;
            _self.params[name].value = value;
        }
    
    _self.setup();
}
function NotSetException(name) {
    this.name = name;
}