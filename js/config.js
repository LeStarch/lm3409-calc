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
        "depends":[]
    },
    "Vin-pp" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
    },
    "Vin-max" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
    },
    "Vout" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
    },
    "Iout" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = 1.24/(5.0*params.get("Rsns")) - params.get("Il-pp")/2.0;
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":["Rsns","Il-pp"]
    },
    "Sys-eff" :
    {
        "guess" : 0.95,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
    },
    //Step 1
    "Fsw" :
    {
        "guess" : (525*Math.pow(10,3)),
        "value": undefined,
        "func" : function(params) {
                      var tmp = (1-params.get("Vout")/(params.get("Sys-eff")*params.get("Vin")))/params.get("Toff");
                      return tmp;
                  },
        "input" : false,
        "usable" : true,
        "depends":["Vout","Sys-eff","Vin","Toff"]
    },
    "Coff" :
    {
        "guess" : 470*Math.pow(10,-12),
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
    },
    "Roff" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var top = -1*(1 - params.get("Vout")/(params.get("Sys-eff") * params.get("Vin")));
                        var bottom = (params.get("Coff")+20*Math.pow(10,-12))*params.get("Fsw")*Math.log(1-1.24/params.get("Vout"));
                        return top/bottom;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":["Vout","Sys-eff","Vin","Coff","Fsw"]
    },
    "Toff" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = -1*(params.get("Coff")+20*Math.pow(10,-12))*params.get("Roff")*Math.log(1-1.24/params.get("Vout"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["Coff","Roff","Vout"]
    },
    //Step 2
    "L1" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vout")*params.get("Toff")/params.get("Il-pp");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":["Vout","Toff","Il-pp"]
    },
    "Il-pp" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vout")*params.get("Toff")/params.get("L1");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":["Vout","Toff","L1"]
    },
    //Step 3
    "Imax" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Iout")+params.get("Il-pp")/2.0;
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["Iout","Il-pp"]
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
        "depends":["Imax"]
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
        "depends":["Fsw","Toff"]
    },
    "Cin-min" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Iout")*params.get("Ton")/params.get("Vin-pp");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["Iout","Ton","Vin-pp"]
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
        "depends":["Iout","Ton","Vin-pp"]
    },
    "Iin-rms" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Iout")*params.get("Fsw")*Math.sqrt(params.get("Ton")*params.get("Toff"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["Iout","Fsw","Ton","Toff"]
    },
    //Step 6
    "D" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("Vout")/(params.get("Vin")*params.get("Sys-eff"));
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["Vout","Vin","Sys-eff"]
    },
    "It" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = params.get("D")*params.get("Iout");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["D","Iout"]
    },
    "It-rms" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = Math.sqrt(params.get("D")*(1+1/12.0*Math.pow(params.get("Il-pp")/params.get("Iout"),2.0)));
                        return params.get("Vout")*tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["D","Il-pp","Iout"]
    },
    "Rdson" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
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
        "depends":["It-rms","Rdson"]
    },
    //Step 7
    "Id" :
    {
        "guess" : undefined,
        "func": function(params) {
                        var tmp = (1-params.get("D"))*params.get("Iout");
                        return tmp;
                    },
        "value" : undefined,
        "input" : false,
        "usable" : false,
        "depends":["D","Iout"]
    },
    "Vd" :
    {
        "guess" : undefined,
        "func": undefined,
        "value" : undefined,
        "input" : false,
        "usable" : true,
        "depends":[]
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
        "depends":["Id","Vd"]
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
        "depends":["Ruv2"]
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
        "depends":["Vhys"]
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
        "depends":["Ruv2","Vturn-on"]
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
        "depends":["Ruv2","Ruv1"]
    }
  }
}