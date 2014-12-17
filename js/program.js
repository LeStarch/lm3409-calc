$().ready(setup);
/**
 * Get input text
 * @param id - id of parameter field
 * @returns {String}
 */
function getInput(id,value) {
    return id+"<input type='text' id='"+id+"'></input><span id='"+id+"-print'>"+value+"</span><br />";
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

function setup() {
    var tmp = CONFIG.params;
    var params = new Params(tmp,changeDisplay);
    
    var form = $("#values");
    
    for (var key in tmp) {
        var val = "unset";
        try{
            val = params.get(key);
        } catch (err) {
            if (err.constructor !== NotSetException)
                throw err;
            console.log(err);
        }
        form.append(getInput(key,val));
        changeDisplay(key,val);
    }
}