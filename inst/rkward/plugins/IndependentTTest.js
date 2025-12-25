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
  
    var dv=getValue("t_dv"); var grp=getValue("t_grp");
    var p_dv=parseVar(dv); var p_grp=parseVar(grp); var df=p_dv.df;
    echo("print(ggpubr::ggboxplot(" + df + ", x=\"" + p_grp.raw_col + "\", y=\"" + p_dv.raw_col + "\", fill=\"" + p_grp.raw_col + "\"))\n");
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(rstatix)){stop(" + i18n("Preview not available, because package rstatix is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(rstatix)\n");
	}	if(is_preview) {
		echo("if(!base::require(ggpubr)){stop(" + i18n("Preview not available, because package ggpubr is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(ggpubr)\n");
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
  
    var dv=getValue("t_dv"); var grp=getValue("t_grp"); var type=getValue("t_type"); 
    var eff=getValue("t_eff"); var desc=getValue("t_desc");
    var p_dv=parseVar(dv); var p_grp=parseVar(grp); var df=p_dv.df; var fmla=p_dv.raw_col+"~"+p_grp.raw_col;
    
    // Dependencies handled by component require
    if (type == "mann") {
       echo("ttest_res <- " + df + " %>% rstatix::wilcox_test(" + fmla + ")\n");
       if (eff == "1") echo("eff_res <- " + df + " %>% rstatix::wilcox_effsize(" + fmla + ")\n");
    } else {
       var eq = (type == "student") ? "TRUE" : "FALSE";
       echo("ttest_res <- " + df + " %>% rstatix::t_test(" + fmla + ", var.equal=" + eq + ")\n");
       if (eff == "1") echo("eff_res <- " + df + " %>% rstatix::cohens_d(" + fmla + ", var.equal=" + eq + ")\n");
    }
    if (desc == "1") echo("desc_res <- " + df + " %>% rstatix::get_summary_stats(" + p_dv.raw_col + ", type=\"common\")\n");
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Independent T-Test results")).print();	
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
  
    var eff=getValue("t_eff"); var desc=getValue("t_desc"); var plot=getValue("t_plot");
    var dv=getValue("t_dv"); var grp=getValue("t_grp");
    var p_dv=parseVar(dv); var p_grp=parseVar(grp); var df=p_dv.df;

    echo("rk.header(\"Independent T-Test Results\", level=3);\n");
    echo("rk.results(ttest_res)\n");
    if (eff == "1") { echo("rk.header(\"Effect Size\", level=4);\n"); echo("rk.results(eff_res)\n"); }
    if (desc == "1") { echo("rk.header(\"Descriptives\", level=4);\n"); echo("rk.results(desc_res)\n"); }
    if (plot == "1") {
       echo("rk.graph.on()\n");
       echo("print(ggpubr::ggboxplot(" + df + ", x=\"" + p_grp.raw_col + "\", y=\"" + p_dv.raw_col + "\", add=\"jitter\", fill=\"" + p_grp.raw_col + "\"))\n");
       echo("rk.graph.off()\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var tSave = getValue("t_save");
		var tSaveActive = getValue("t_save.active");
		var tSaveParent = getValue("t_save.parent");
		// assign object to chosen environment
		if(tSaveActive) {
			echo(".GlobalEnv$" + tSave + " <- ttest_res\n");
		}	
	}

}

