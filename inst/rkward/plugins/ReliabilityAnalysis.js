// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(psych)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        var df = '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
    var vars = getValue("r_vars"); var item = getValue("r_item");
    var varList = vars.split("\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\"" + c + "\""; }).join(", ") + ")";
  
    echo("rel_data <- " + dfName + "[, " + col_vec + "]\n");
    echo("rel_res <- psych::alpha(rel_data, check.keys=TRUE)\n");
  
}

function printout(is_preview){
	// printout the results
	new Header(i18n("Reliability Analysis results")).print();

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        var df = '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
    var vars = getValue("r_vars"); var item = getValue("r_item");
    var varList = vars.split("\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\"" + c + "\""; }).join(", ") + ")";
  
    echo("rk.header(\"Reliability Analysis\", level=3);\n");
    echo("rk.header(\"Overall Statistics\", level=4);\n");
    echo("rk.results(as.data.frame(rel_res$total))\n");
    if (item == "1") { echo("rk.header(\"Item-Total Statistics\", level=4);\n"); echo("rk.results(as.data.frame(rel_res$alpha.drop))\n"); }
  
	//// save result object
	// read in saveobject variables
	var rSave = getValue("r_save");
	var rSaveActive = getValue("r_save.active");
	var rSaveParent = getValue("r_save.parent");
	// assign object to chosen environment
	if(rSaveActive) {
		echo(".GlobalEnv$" + rSave + " <- rel_res\n");
	}

}

