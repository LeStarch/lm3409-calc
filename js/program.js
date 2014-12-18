$().ready(setup);
/**
 * Get input text
 * @param id - id of parameter field
 * @returns {String}
 */
function getInput(id,value,en) {
    var str = "<tr><td>"+id+"</td><td><input type='text' id='"+id+"' class='text' ";
    if (!en)
        str+="disabled";
    str = str + "></input></td><td><input id='"+id+"' type='checkbox' class='check' ";
    if (!en)
        str+="disabled";
    str = str+ "></input></td><td><span id='"+id+"-print'>"+value+"</span><td></tr>";
    return str;
}
/**
 * Change the displayed value of an element.
 * @param id - id of element
 * @param value - new value of element
 */
function changeDisplay(id,value) {
    var sel = $("#"+id+"-print");
    sel.text(""+value);
}

/**
 * Setup function
 */
function setup() {
    var params = new Params(CONFIG.params,changeDisplay);
    
    var form = $("#values");
    for (var key in params.params) {
        form.append(getInput(key,"unset",params.params[key].usable));
        var tmp = $("#values :input.check#"+key);
        tmp.prop('checked', params.params[key].input);
    }
    /**
     * Refresh all elements
     */
    function refresh() {
        for (var key in params.params) {
            var val = "unset";
            try{
                val = params.get(key);
            } catch (err) {
                if (err.constructor !== NotSetException)
                    throw err;
                console.log(err);
            }
            changeDisplay(key,val);
        }
    }
    /**
     * What to do when changing text
     */
    function reactText(event) {
        var id = event.target.id;
        var val = event.target.value;
        params.set(id,val,true);
        refresh();
    }
    $("#values :input.text").change(reactText);
    /**
     * What to do when changing checks
     */
    function reactCheck(event) {
        var id = event.target.id;
        var val = event.target.checked;
        //Lock
        var field = $("#values :input.text#"+id);
        if (val)
        {
            params.params[id].input = true;
            params.set(id,field.val(),true);
        } else {
            params.params[id].input = false;
            var tmp = field.val();
            try {
                if (params.params[id].func !== undefined)
                    tmp = params.params[id].func(params); 
            }  catch (err) {
                if (err.constructor !== NotSetException)
                    throw err;
            }
            params.set(id,tmp,true); 
        }
        refresh();
    }
    $("#values :input.check").change(reactCheck);
    refresh();
}