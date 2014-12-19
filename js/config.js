/**
   "name" :
    {
        "guess" : <initial guess from datasheet> or undefined,
        "func": <function taking params> or undefined,
        "value" : undefined -- actual calculated value, don't change
        "input" : false/true -- came from user input concrete,
        "usable" : true/false -- can the user twittle this,
        "depends":[<other params the function depends on>]
    }
 */
var CONFIG = {
  "params" : 
  {
    //Output parameters
    "Vin" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Voltage in from the input source"
    },
    "Vin-pp" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Voltage peak-to-peak ripple (10% of Vin)"
    },
    "Vled" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Voltage output of circuit"
    },
    "Iled" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = 1.24/(5.0*params.get("Rsns")) - params.get("Il-pp")/2.0;
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Current output from system"
    },
    "Sys-eff" :
    {
        "guess" : 0.95,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"System efficiency, suggested to be between 80% and 95%"
    },
    //Step 1
    "Fsw" :
    {
        "guess" : (525*Math.pow(10,3)),
        "value": undefined,
        "func" : function(params) {
                      var tmp = (1-params.get("Vled")/(params.get("Sys-eff")*params.get("Vin")))/params.get("Toff");
                      return tmp;
                  },
        "input" : false,
        "usable" : true,
        "description":"System xwitching frequency, affects inductor and P-FET"
    },
    "Coff" :
    {
        "guess" : 470*Math.pow(10,-12),
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Toff timing capacitor. *Remember calculation adds 20pF parasitic capacitance."
    },
    "Roff" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var top = -1*(1 - params.get("Vled")/(params.get("Sys-eff") * params.get("Vin")));
                        var bottom = (params.get("Coff")+20*Math.pow(10,-12))*params.get("Fsw")*Math.log(1-1.24/params.get("Vled"));
                        return top/bottom;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Toff timing resistance."
    },
    "Toff" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = -1*(params.get("Coff")+20*Math.pow(10,-12))*params.get("Roff")*Math.log(1-1.24/params.get("Vled"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Off time, roughlty constance based on Roff Coff and Vled"
    },
    //Step 2
    "L1" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vled")*params.get("Toff")/params.get("Il-pp");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Inductor inductance"
    },
    "Il-pp" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vled")*params.get("Toff")/params.get("L1");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Maximum peak-to-peak current ripple"
    },
    //Step 3
    "Imax" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Iled")+params.get("Il-pp")/2.0;
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Maximum current"
    },
    "Rsns" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = 1.24/(5.0*params.get("Imax"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Sensing resistance"
    },
    //Step 4: none
    //Step 5
    "Ton" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = 1/params.get("Fsw") - params.get("Toff");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"On time"
    },
    "Cin-min" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Iled")*params.get("Ton")/params.get("Vin-pp");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Minimum input capacitance"
    },
    "Cin" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = 2.0*params.get("Cin-min");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Input capacitance (recommended)"
    },
    "Iin-rms" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Iled")*params.get("Fsw")*Math.sqrt(params.get("Ton")*params.get("Toff"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Root-Mean-Square input current"
    },
    //Step 6
    "D" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vled")/(params.get("Vin")*params.get("Sys-eff"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"D"
    },
    "It" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("D")*params.get("Iled");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"It (current through PFET)?? Remember to add 30% to be safe"
    },
    "It-rms" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = Math.sqrt(params.get("D")*(1+1/12.0*Math.pow(params.get("Il-pp")/params.get("Iled"),2.0)));
                        return params.get("Iled")*tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Irtms"
    },
    "Rdson" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"PFET drain-source resistance (when on)"
    },
    "Pt" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = Math.pow(params.get("It-rms"),2.0)*params.get("Rdson");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"PFET power"
    },
    //Step 7
    "Id" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = (1-params.get("D"))*params.get("Iled");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Current through diode, add 30%"
    },
    "Vd" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Diode reverse voltage"
    },
    "Pd" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Id")*params.get("Vd");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Diode power rating"
    },
    //Step 8
    "Vhys" :
    {
        "guess" : 1.1,
        "func": function(params) {
                        var tmp = params.get("Ruv2")*22*Math.pow(10,-6);
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "description":"Hysterisis voltage"
    },
    "Ruv2" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vhys")/(22*Math.pow(10,-6));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Off voltage resistor ladder resistance 2"
    },
    "Ruv1" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = 1.24*params.get("Ruv2")/(params.get("Vturn-on")-1.24);
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Off voltage resistor ladder resistance 1"
    },
    "Vturn-on" :
    {
        "guess" : 10,
        "func": function(params) {
                        var tmp = 1.24*(params.get("Ruv2")+params.get("Ruv1"))/params.get("Ruv1");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "description":"Voltage for turn on"
    }
  }
}