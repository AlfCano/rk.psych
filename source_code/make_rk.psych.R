local({
  # =========================================================================================
  # 1. Package Definition and Metadata
  # =========================================================================================
  require(rkwarddev)
  rkwarddev.required("0.10-3")

  package_about <- rk.XML.about(
    name = "rk.psych",
    author = person(
      given = "Alfonso",
      family = "Cano",
      email = "alfonso.cano@correo.buap.mx",
      role = c("aut", "cre")
    ),
    about = list(
      desc = "An RKWard plugin for Psychology/Social Sciences (Frequentist Suite). Features 'All-in-One' dialogs for T-Tests, ANOVA, Correlation, and Reliability.",
      version = "0.0.1", # Frozen
      url = "https://github.com/AlfCano/rk.psych",
      license = "GPL (>= 3)"
    )
  )

  # Unified Flat Hierarchy
  # Analysis > Psychology / Social Science > Frequentist > [Component]
  flat_hierarchy <- list("analysis", "Psychology / Social Science", "Frequentist")

  # =========================================================================================
  # JS Helper
  # =========================================================================================
  js_parse_helper <- "
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        var df = '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\"']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  "

  # Shared Variable Selector
  var_selector <- rk.XML.varselector(id.name = "var_selector")

  # =========================================================================================
  # MAIN PLUGIN: Independent T-Test
  # =========================================================================================

  help_ttest <- rk.rkh.doc(
    title = rk.rkh.title(text = "Independent T-Test (All-in-One)"),
    summary = rk.rkh.summary(text = "Perform independent samples t-test or Mann-Whitney U test with effect sizes."),
    usage = rk.rkh.usage(text = "Select numeric DV and Grouping Variable.")
  )

  t_dv <- rk.XML.varslot(label = "Dependent Variable", source = "var_selector", classes = "numeric", required = TRUE, id.name = "t_dv")
  t_grp <- rk.XML.varslot(label = "Grouping Variable", source = "var_selector", required = TRUE, id.name = "t_grp")

  t_type <- rk.XML.radio(label = "Test", options = list(
      "Student's t" = list(val = "student"),
      "Welch's t (Unequal Variances)" = list(val = "welch", chk = TRUE),
      "Mann-Whitney U" = list(val = "mann")
  ), id.name = "t_type")

  t_eff <- rk.XML.cbox(label = "Effect Size", value = "1", chk = TRUE, id.name = "t_eff")
  t_desc <- rk.XML.cbox(label = "Descriptives", value = "1", chk = TRUE, id.name = "t_desc")
  t_plot <- rk.XML.cbox(label = "Boxplot + Jitter", value = "1", chk = TRUE, id.name = "t_plot")

  t_save <- rk.XML.saveobj(label = "Save Results", chk = TRUE, initial = "ttest_res", id.name = "t_save")
  t_preview <- rk.XML.preview(mode = "plot")

  dialog_ttest <- rk.XML.dialog(
      label = "Independent T-Test",
      child = rk.XML.row(var_selector, rk.XML.col(t_dv, t_grp, t_type, t_eff, t_desc, t_plot, t_save, t_preview))
  )

  js_ttest_calc <- paste0(js_parse_helper, '
    var dv=getValue("t_dv"); var grp=getValue("t_grp"); var type=getValue("t_type");
    var eff=getValue("t_eff"); var desc=getValue("t_desc");
    var p_dv=parseVar(dv); var p_grp=parseVar(grp); var df=p_dv.df; var fmla=p_dv.raw_col+"~"+p_grp.raw_col;

    // Dependencies handled by component require
    if (type == "mann") {
       echo("ttest_res <- " + df + " %>% rstatix::wilcox_test(" + fmla + ")\\n");
       if (eff == "1") echo("eff_res <- " + df + " %>% rstatix::wilcox_effsize(" + fmla + ")\\n");
    } else {
       var eq = (type == "student") ? "TRUE" : "FALSE";
       echo("ttest_res <- " + df + " %>% rstatix::t_test(" + fmla + ", var.equal=" + eq + ")\\n");
       if (eff == "1") echo("eff_res <- " + df + " %>% rstatix::cohens_d(" + fmla + ", var.equal=" + eq + ")\\n");
    }
    if (desc == "1") echo("desc_res <- " + df + " %>% rstatix::get_summary_stats(" + p_dv.raw_col + ", type=\\"common\\")\\n");
  ')

  js_ttest_print <- paste0(js_parse_helper, '
    var eff=getValue("t_eff"); var desc=getValue("t_desc"); var plot=getValue("t_plot");
    var dv=getValue("t_dv"); var grp=getValue("t_grp");
    var p_dv=parseVar(dv); var p_grp=parseVar(grp); var df=p_dv.df;

    echo("rk.header(\\"Independent T-Test Results\\", level=3);\\n");
    echo("rk.results(ttest_res)\\n");
    if (eff == "1") { echo("rk.header(\\"Effect Size\\", level=4);\\n"); echo("rk.results(eff_res)\\n"); }
    if (desc == "1") { echo("rk.header(\\"Descriptives\\", level=4);\\n"); echo("rk.results(desc_res)\\n"); }
    if (plot == "1") {
       echo("rk.graph.on()\\n");
       echo("print(ggpubr::ggboxplot(" + df + ", x=\\"" + p_grp.raw_col + "\\", y=\\"" + p_dv.raw_col + "\\", add=\\"jitter\\", fill=\\"" + p_grp.raw_col + "\\"))\\n");
       echo("rk.graph.off()\\n");
    }
  ')

  js_ttest_prev <- paste0(js_parse_helper, '
    var dv=getValue("t_dv"); var grp=getValue("t_grp");
    var p_dv=parseVar(dv); var p_grp=parseVar(grp); var df=p_dv.df;
    echo("print(ggpubr::ggboxplot(" + df + ", x=\\"" + p_grp.raw_col + "\\", y=\\"" + p_dv.raw_col + "\\", fill=\\"" + p_grp.raw_col + "\\"))\\n");
  ')

  # =========================================================================================
  # COMPONENT 2: One-Way ANOVA
  # =========================================================================================

  help_anova <- rk.rkh.doc(
    title = rk.rkh.title(text = "One-Way ANOVA (All-in-One)"),
    summary = rk.rkh.summary(text = "One-Way ANOVA with Post-Hoc tests and Effect Size."),
    usage = rk.rkh.usage(text = "Select Dependent Variable and Factor.")
  )

  a_dv <- rk.XML.varslot(label = "Dependent Variable", source = "var_selector", classes = "numeric", required = TRUE, id.name = "a_dv")
  a_fac <- rk.XML.varslot(label = "Factor", source = "var_selector", required = TRUE, id.name = "a_fac")

  a_opts <- rk.XML.frame(
      rk.XML.cbox(label = "Effect Size (Generalized Eta Squared)", value = "1", chk = TRUE, id.name = "a_eff"),
      rk.XML.cbox(label = "Post-Hoc Test (Tukey HSD)", value = "1", chk = TRUE, id.name = "a_post"),
      rk.XML.cbox(label = "Homogeneity (Levene's Test)", value = "1", chk = TRUE, id.name = "a_homo"),
      label = "Options"
  )
  a_save <- rk.XML.saveobj(label = "Save ANOVA Object", chk = TRUE, initial = "anova_res", id.name = "a_save")
  a_preview <- rk.XML.preview(mode = "plot")

  dialog_anova <- rk.XML.dialog(label = "One-Way ANOVA", child = rk.XML.row(var_selector, rk.XML.col(a_dv, a_fac, a_opts, a_save, a_preview)))

  js_anova_calc <- paste0(js_parse_helper, '
    var dv=getValue("a_dv"); var fac=getValue("a_fac");
    var p_dv=parseVar(dv); var p_fac=parseVar(fac); var df=p_dv.df; var fmla=p_dv.raw_col+"~"+p_fac.raw_col;
    var post=getValue("a_post"); var homo=getValue("a_homo");

    echo("anova_res <- " + df + " %>% rstatix::anova_test(" + fmla + ", effect.size = \\"ges\\")\\n");
    if (post == "1") echo("post_res <- " + df + " %>% rstatix::tukey_hsd(" + fmla + ")\\n");
    if (homo == "1") echo("levene_res <- " + df + " %>% rstatix::levene_test(" + fmla + ")\\n");
  ')
  js_anova_print <- paste0(js_parse_helper, '
    var dv=getValue("a_dv"); var fac=getValue("a_fac"); var p_dv=parseVar(dv); var p_fac=parseVar(fac); var df=p_dv.df;
    var post=getValue("a_post"); var homo=getValue("a_homo");

    echo("rk.header(\\"One-Way ANOVA Results\\", level=3);\\n");
    echo("rk.header(\\"ANOVA Table\\", level=4);\\n");
    echo("rk.results(rstatix::get_anova_table(anova_res))\\n");
    if (homo == "1") { echo("rk.header(\\"Homogeneity\\", level=4);\\n"); echo("rk.results(levene_res)\\n"); }
    if (post == "1") { echo("rk.header(\\"Post-Hoc\\", level=4);\\n"); echo("rk.results(post_res)\\n"); }
    echo("rk.graph.on()\\n");
    echo("print(ggpubr::ggboxplot(" + df + ", x=\\"" + p_fac.raw_col + "\\", y=\\"" + p_dv.raw_col + "\\", add=\\"jitter\\", fill=\\"" + p_fac.raw_col + "\\"))\\n");
    echo("rk.graph.off()\\n");
  ')
  js_anova_prev <- paste0(js_parse_helper, '
    var dv=getValue("a_dv"); var fac=getValue("a_fac"); var p_dv=parseVar(dv); var p_fac=parseVar(fac); var df=p_dv.df;
    echo("print(ggpubr::ggboxplot(" + df + ", x=\\"" + p_fac.raw_col + "\\", y=\\"" + p_dv.raw_col + "\\", fill=\\"" + p_fac.raw_col + "\\"))\\n");
  ')

  comp_anova <- rk.plugin.component("One-Way ANOVA", xml=list(dialog=dialog_anova), js=list(require=c("rstatix", "ggpubr"), calculate=js_anova_calc, printout=js_anova_print, preview=js_anova_prev), hierarchy=flat_hierarchy, rkh=list(help=help_anova))

  # =========================================================================================
  # COMPONENT 3: Correlation Matrix
  # =========================================================================================

  help_cor <- rk.rkh.doc(
    title = rk.rkh.title(text = "Correlation Matrix"),
    summary = rk.rkh.summary(text = "Calculate and visualize correlation matrices."),
    usage = rk.rkh.usage(text = "Select multiple numeric variables.")
  )

  c_vars <- rk.XML.varslot(label = "Variables", source = "var_selector", classes = "numeric", multi = TRUE, required = TRUE, id.name = "c_vars")
  c_method <- rk.XML.dropdown(label = "Method", options = list("Pearson" = list(val = "pearson", chk=TRUE), "Spearman" = list(val = "spearman")), id.name = "c_method")
  c_sig <- rk.XML.cbox(label = "Flag Significant Correlations", value = "1", chk = TRUE, id.name = "c_sig")
  c_plot <- rk.XML.cbox(label = "Plot Heatmap", value = "1", chk = TRUE, id.name = "c_plot")
  c_save <- rk.XML.saveobj(label = "Save Matrix", chk = TRUE, initial = "cor_res", id.name = "c_save")
  c_preview <- rk.XML.preview(mode = "plot")

  dialog_cor <- rk.XML.dialog(label = "Correlation Matrix", child = rk.XML.row(var_selector, rk.XML.col(c_vars, c_method, c_sig, c_plot, c_save, c_preview)))

  js_cor_body <- '
    var vars = getValue("c_vars"); var method = getValue("c_method"); var sig = getValue("c_sig"); var plot = getValue("c_plot");
    var varList = vars.split("\\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\\\"" + c + "\\\""; }).join(", ") + ")";
  '
  js_cor_calc <- paste0(js_parse_helper, js_cor_body, '
    echo("cor_res <- " + dfName + " %>% dplyr::select(" + col_vec + ") %>% rstatix::cor_mat(method = \\"" + method + "\\")\\n");
    if (sig == "1") echo("cor_marked <- cor_res %>% rstatix::cor_mark_significant()\\n");
  ')
  js_cor_print <- paste0(js_parse_helper, js_cor_body, '
    echo("rk.header(\\"Correlation Matrix (" + method + ")\\", level=3);\\n");
    if (sig == "1") { echo("rk.results(cor_marked)\\n"); } else { echo("rk.results(cor_res)\\n"); }
    if (plot == "1") {
        echo("rk.graph.on()\\n");
        echo("print(cor_res %>% rstatix::cor_plot(type=\\"lower\\", method=\\"circle\\", p.mat=rstatix::cor_pmat(cor_res)))\\n");
        echo("rk.graph.off()\\n");
    }
  ')
  js_cor_prev <- paste0(js_parse_helper, js_cor_body, 'echo("print(cor_res %>% rstatix::cor_plot(type=\\"lower\\"))\\n");')

  comp_cor <- rk.plugin.component("Correlation Matrix", xml=list(dialog=dialog_cor), js=list(require="rstatix", calculate=js_cor_calc, printout=js_cor_print, preview=js_cor_prev), hierarchy=flat_hierarchy, rkh=list(help=help_cor))

  # =========================================================================================
  # COMPONENT 4: Reliability Analysis
  # =========================================================================================

  help_rel <- rk.rkh.doc(
    title = rk.rkh.title(text = "Reliability Analysis"),
    summary = rk.rkh.summary(text = "Calculate Cronbach's Alpha and Item-Total statistics."),
    usage = rk.rkh.usage(text = "Select the items (columns) belonging to the scale.")
  )

  r_vars <- rk.XML.varslot(label = "Items", source = "var_selector", classes = "numeric", multi = TRUE, required = TRUE, id.name = "r_vars")
  r_opts <- rk.XML.frame(rk.XML.cbox(label = "Item-Total Statistics", value = "1", chk = TRUE, id.name = "r_item"), label = "Options")
  r_save <- rk.XML.saveobj(label = "Save Object", chk = TRUE, initial = "rel_res", id.name = "r_save")
  dialog_rel <- rk.XML.dialog(label = "Reliability Analysis", child = rk.XML.row(var_selector, rk.XML.col(r_vars, r_opts, r_save)))

  js_rel_body <- '
    var vars = getValue("r_vars"); var item = getValue("r_item");
    var varList = vars.split("\\n"); var dfName = ""; var cols = [];
    for (var i = 0; i < varList.length; i++) { var p = parseVar(varList[i]); if (i === 0) dfName = p.df; cols.push(p.raw_col); }
    var col_vec = "c(" + cols.map(function(c){ return "\\\"" + c + "\\\""; }).join(", ") + ")";
  '
  js_rel_calc <- paste0(js_parse_helper, js_rel_body, '
    echo("rel_data <- " + dfName + "[, " + col_vec + "]\\n");
    echo("rel_res <- psych::alpha(rel_data, check.keys=TRUE)\\n");
  ')
  js_rel_print <- paste0(js_parse_helper, js_rel_body, '
    echo("rk.header(\\"Reliability Analysis\\", level=3);\\n");
    echo("rk.header(\\"Overall Statistics\\", level=4);\\n");
    echo("rk.results(as.data.frame(rel_res$total))\\n");
    if (item == "1") { echo("rk.header(\\"Item-Total Statistics\\", level=4);\\n"); echo("rk.results(as.data.frame(rel_res$alpha.drop))\\n"); }
  ')

  comp_rel <- rk.plugin.component("Reliability Analysis", xml=list(dialog=dialog_rel), js=list(require="psych", calculate=js_rel_calc, printout=js_rel_print), hierarchy=flat_hierarchy, rkh=list(help=help_rel))

  # =========================================================================================
  # BUILD SKELETON
  # =========================================================================================

  rk.plugin.skeleton(
    about = package_about,
    path = ".",

    # 1. MAIN PLUGIN: Independent T-Test
    xml = list(dialog = dialog_ttest),
    js = list(require=c("rstatix", "ggpubr"), calculate=js_ttest_calc, printout=js_ttest_print, preview=js_ttest_prev),
    rkh = list(help = help_ttest),

    # 2. COMPONENTS: The other 3
    components = list(
        comp_anova,
        comp_cor,
        comp_rel
    ),

    # 3. PLUGIN MAP: Defines the Main Plugin's Menu Entry
    pluginmap = list(
        name = "Independent T-Test",
        hierarchy = flat_hierarchy
    ),

    create = c("pmap", "xml", "js", "desc", "rkh"),
    load = TRUE,
    overwrite = TRUE,
    show = FALSE
  )

  cat("\nPlugin package 'rk.psych' (Frequentist Edition - v0.0.1) generated successfully.\n")
  cat("To complete installation:\n")
  cat("  1. rk.updatePluginMessages(path=\".\")\n")
  cat("  2. devtools::install(\".\")\n")
})
