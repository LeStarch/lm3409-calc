/**
   "name" :
    {
        "guess" : <initial guess from datasheet> or undefined,
        "function": <function taking params> or undefined,
        "value" : undefined -- actual calculated value, don't change
        "user-input" : false/true -- came from user input concrete,
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
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Vin-pp" :
    {
        "guess" : undefined,
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Vin-max" :
    {
        "guess" : undefined,
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Vout" :
    {
        "guess" : undefined,
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Iout" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = 1.24/(5.0*params.get("Rsns")) - params.get("Il-pp")/2;
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Rsns","Il-pp"]
    },
    "η" :
    {
        "guess" : 0.95,
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    //Step 1
    "Fsw" :
    {
        "guess" : 525*Math.pow(10,3),
        "function": undefined,
        "value" : function(params) {
                      var tmp = (1-params.get("Vout")/(params.get("η")*params.get("Vin")))/params.get("Toff");
                      return tmp;
                  },
        "user-input" : false,
        "usable" : false,
        "depends":["Vout","η","Vin","Toff"]
    },
    "Coff" :
    {
        "guess" : 470*Math.pow(10,-12),
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Roff" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var top = -1*(1 - params.get("Vout")/(params.get("η") * params.get("Vin")));
                        var bottom = (params.get("Coff")+20*Math.pow(10,-12))*params.get("Fsw")*Math.ln(1-1.24/params.get("Vout"));
                        return top/bottom;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Vout","η","Vin","Coff","Fsw"]
    },
    "Toff" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = (params.get("Coff")+20*Math.pow(10,-12))*params.get("Roff")*Math.ln(1-1.24/params.get("Vout"));
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Coff","Roff","Vout"]
    },
    //Step 2
    "L1" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Vout")*params.get("Toff")/params.get("Lrip");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Vout","Toff","Lrip"]
    },
    "Il-pp" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Vout")*params.get("Toff")/params.get("L1");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Vout","Toff","L1"]
    },
    //Step 3
    "Imax" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Iout")+params.get("Il-pp")/2.0;
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Iout","Il-pp"]
    },
    "Rsns" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = 1.24/(5.0*params.get("Imax"));
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Imax"]
    },
    //Step 4: none
    //Step 5
    "Ton" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = 1/params.get("Fsw") - params.get("Toff");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Fsw","Toff"]
    },
    "Cin-min" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Iout")*params.get("Ton")/params.get("Vin-pp");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Iout","Ton","Vin-pp"]
    },
    "Cin" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = 2.0*params.get("Cin-min");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Iout","Ton","Vin-pp"]
    },
    "Iin-rms" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Iout")*params.get("Fsw")*Math.sqrt(params.get("Ton")*params.get("Toff"));
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Iout","Fsw","Ton","Toff"]
    },
    //Step 6
    "D" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Vout")/(params.get("Vin")*params.get("η"));
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Vout","Vin","η"]
    },
    "It" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("D")*params.get("Iout");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["D","Iout"]
    },
    "It-rms" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = Math.sqrt(params.get("D")*(1+1/12.0*Math.pow(params.get("Il-pp")/params.get("Iout"),2.0)));
                        return params.get("Vout")*tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["D","Il-pp","Iout"]
    },
    "Rdson" :
    {
        "guess" : undefined,
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Pt" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = Math.pow(params.get("It-rms"),2.0)*params.get("Rdson");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["It-rms","Rdson"]
    },
    //Step 7
    "Id" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = (1-params.get("D"))*params.get("Iout");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["D","Iout"]
    },
    "Vd" :
    {
        "guess" : undefined,
        "function": undefined,
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":[]
    },
    "Pd" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Id")*params.get("Vd");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Id","Vd"]
    },
    //Step 8
    "Vhys" :
    {
        "guess" : 1.1,
        "function": function(params) {
                        var tmp = params.get("Ruv2")*22*Mapth.pow(10,-6);
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : false,
        "depends":["Ruv2"]
    },
    "Ruv2" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = params.get("Vhys")/(22*Mapth.pow(10,-6));
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Vhys"]
    },
    "Ruv1" :
    {
        "guess" : undefined,
        "function": function(params) {
                        var tmp = 1.24*params.get("Ruv2")/(params.get("Vturn-on")-1.24);
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Ruv2","Vturn-on"]
    },
    "Vturn-on" :
    {
        "guess" : 10,
        "function": function(params) {
                        var tmp = 1.24*(params.get("Ruv2")+params.get("Ruv1"))/params.get("Ruv1");
                        return tmp;
                    },
        "value" : undefined,
        "user-input" : false,
        "usable" : true,
        "depends":["Ruv2","Ruv1"]
    }
  }
}