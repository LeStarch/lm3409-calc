$().ready(setup);
/**
 * Get input text
 * @param id - id of parameter field
 * @returns {String}
 */
function getInput(id,value,en,desc) {
    var str = "<tr><td>"+id+"</td><td><input type='text' id='"+id+"' class='text' ";
    if (!en)
        str+="disabled";
    str = str + "></input></td><td><input id='"+id+"' type='checkbox' class='check' ";
    if (!en)
        str+="disabled";
    str = str+ "></input></td><td><span id='"+id+"-print'>"+value+"</span></td><td>"+desc+"</td</tr>";
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
 * Lock and element
 * @param name - name of element to lock
 */
function lock(name) {
    var tmp = $("#values :input.check#"+name);
    tmp.prop('checked', true);
}
/**
 * Setup function
 */
function setup() {
    var params = new Params(CONFIG.params,changeDisplay,lock);
    
    var form = $("#values");
    for (var key in params.params) {
        form.append(getInput(key,"unset",params.params[key].usable,params.params[key].description));
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
        params.set(id,val);
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
        params.params[id].input = val;
        var txt = $("#values :input.text #"+id);
        params.set(id,txt.val());
        refresh();
    }
    $("#values :input.check").change(reactCheck);
    refresh();
}