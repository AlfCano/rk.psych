// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
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
  
    var vars = getValue("c_vars"); var method = getValue("c_method"); var sig = getValue("c_sig"); var plot = getValue("c_plot");
    var varList = vars.split("\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\"" + c + "\""; }).join(", ") + ")";
  echo("print(cor_res %>% rstatix::cor_plot(type=\"lower\"))\n");
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(rstatix)){stop(" + i18n("Preview not available, because package rstatix is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(rstatix)\n");
	}
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
  
    var vars = getValue("c_vars"); var method = getValue("c_method"); var sig = getValue("c_sig"); var plot = getValue("c_plot");
    var varList = vars.split("\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\"" + c + "\""; }).join(", ") + ")";
  
    echo("cor_res <- " + dfName + " %>% dplyr::select(" + col_vec + ") %>% rstatix::cor_mat(method = \"" + method + "\")\n");
    if (sig == "1") echo("cor_marked <- cor_res %>% rstatix::cor_mark_significant()\n");
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Correlation Matrix results")).print();	
	}
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
  
    var vars = getValue("c_vars"); var method = getValue("c_method"); var sig = getValue("c_sig"); var plot = getValue("c_plot");
    var varList = vars.split("\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\"" + c + "\""; }).join(", ") + ")";
  
    echo("rk.header(\"Correlation Matrix (" + method + ")\", level=3);\n");
    if (sig == "1") { echo("rk.results(cor_marked)\n"); } else { echo("rk.results(cor_res)\n"); }
    if (plot == "1") {
        echo("rk.graph.on()\n");
        echo("print(cor_res %>% rstatix::cor_plot(type=\"lower\", method=\"circle\", p.mat=rstatix::cor_pmat(cor_res)))\n");
        echo("rk.graph.off()\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var cSave = getValue("c_save");
		var cSaveActive = getValue("c_save.active");
		var cSaveParent = getValue("c_save.parent");
		// assign object to chosen environment
		if(cSaveActive) {
			echo(".GlobalEnv$" + cSave + " <- cor_res\n");
		}	
	}

}

