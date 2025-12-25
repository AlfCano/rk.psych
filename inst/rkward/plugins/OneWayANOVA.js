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
  
    var dv=getValue("a_dv"); var fac=getValue("a_fac"); var p_dv=parseVar(dv); var p_fac=parseVar(fac); var df=p_dv.df;
    echo("print(ggpubr::ggboxplot(" + df + ", x=\"" + p_fac.raw_col + "\", y=\"" + p_dv.raw_col + "\", fill=\"" + p_fac.raw_col + "\"))\n");
  
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
  
    var dv=getValue("a_dv"); var fac=getValue("a_fac");
    var p_dv=parseVar(dv); var p_fac=parseVar(fac); var df=p_dv.df; var fmla=p_dv.raw_col+"~"+p_fac.raw_col;
    var post=getValue("a_post"); var homo=getValue("a_homo");
    
    echo("anova_res <- " + df + " %>% rstatix::anova_test(" + fmla + ", effect.size = \"ges\")\n");
    if (post == "1") echo("post_res <- " + df + " %>% rstatix::tukey_hsd(" + fmla + ")\n");
    if (homo == "1") echo("levene_res <- " + df + " %>% rstatix::levene_test(" + fmla + ")\n");
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("One-Way ANOVA results")).print();	
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
  
    var dv=getValue("a_dv"); var fac=getValue("a_fac"); var p_dv=parseVar(dv); var p_fac=parseVar(fac); var df=p_dv.df;
    var post=getValue("a_post"); var homo=getValue("a_homo");
    
    echo("rk.header(\"One-Way ANOVA Results\", level=3);\n");
    echo("rk.header(\"ANOVA Table\", level=4);\n");
    echo("rk.results(rstatix::get_anova_table(anova_res))\n");
    if (homo == "1") { echo("rk.header(\"Homogeneity\", level=4);\n"); echo("rk.results(levene_res)\n"); }
    if (post == "1") { echo("rk.header(\"Post-Hoc\", level=4);\n"); echo("rk.results(post_res)\n"); }
    echo("rk.graph.on()\n");
    echo("print(ggpubr::ggboxplot(" + df + ", x=\"" + p_fac.raw_col + "\", y=\"" + p_dv.raw_col + "\", add=\"jitter\", fill=\"" + p_fac.raw_col + "\"))\n");
    echo("rk.graph.off()\n");
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var aSave = getValue("a_save");
		var aSaveActive = getValue("a_save.active");
		var aSaveParent = getValue("a_save.parent");
		// assign object to chosen environment
		if(aSaveActive) {
			echo(".GlobalEnv$" + aSave + " <- anova_res\n");
		}	
	}

}

