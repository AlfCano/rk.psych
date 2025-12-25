# rk.psych

![Version](https://img.shields.io/badge/Version-0.0.1-orange)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)
![AI Assistance](https://img.shields.io/badge/Created%20with-Gemini-4E86F8)

**rk.psych** is an external plug-in for [RKWard](https://rkward.kde.org/) designed to provide a workflow similar to **Jamovi** or **SPSS**. It consolidates frequentist statistical tests, assumption checks, effect sizes, and visualizations into single "All-in-One" dialogs.

## Features

### "All-in-One" Frequentist Tests
Stop running three different plugins to get one result. `rk.psych` provides:
*   **T-Tests:** Independent Samples (Student/Welch) & Mann-Whitney U. Includes Cohen's d, Descriptives, and Boxplots/Violin plots.
*   **ANOVA:** One-Way ANOVA with Post-Hoc tests (Tukey HSD), Effect Size (Generalized Eta Squared), and Homogeneity checks (Levene's Test).
*   **Correlation:** Pearson & Spearman matrices with significance flags and Heatmap visualizations.
*   **Reliability:** Cronbach's Alpha with "Item-Total Statistics" (Alpha if item dropped).

## Dependencies

This plugin relies on the following R packages:
*   `rstatix` (Tidy statistics)
*   `ggpubr` (Publication-ready plots)
*   `psych` (Reliability analysis)
*   `rkwarddev` (Development)

## Installation

### Installing from GitHub
You can install the latest version directly from GitHub using the `devtools` or `remotes` package in R:

1.  Execute the commands printed in the console:
```r
library(devtools) # or library(remotes)
install_github("AlfCano/rk.psych")
```
2.  Restart RKWard.

## Usage Guide & Tutorials

The plugin adds a new entry to the main menu under:
**Analysis > Psychology / Social Science > Frequentist**

### Phase 1: Data Preparation
To follow these tutorials, please run this code in the **RKWard R Console** to load the necessary datasets:

```r
# Load standard datasets
data(ToothGrowth)  # For T-Tests
data(PlantGrowth)  # For ANOVA
data(mtcars)       # For Correlation

# Create a Dummy Survey for Reliability (5 items, 50 people)
set.seed(123)
survey_data <- data.frame(
  Q1 = sample(1:5, 50, replace=TRUE),
  Q2 = sample(1:5, 50, replace=TRUE),
  Q3 = sample(1:5, 50, replace=TRUE),
  Q4 = sample(1:5, 50, replace=TRUE),
  Q5 = sample(1:5, 50, replace=TRUE)
)
```

### Phase 2: T-Tests (Independent)
**Goal:** Compare tooth length (`len`) by supplement type (`supp`).
1.  **Menu:** `Psychology / Social Science > Frequentist > Independent T-Test`
2.  **Dependent Variable:** Select `len` (from `ToothGrowth`).
3.  **Grouping Variable:** Select `supp` (from `ToothGrowth`).
4.  **Test:** Select **Welch's t (Unequal Variances)**.
5.  **Options:** Check "Effect Size", "Descriptives", and "Boxplot + Jitter".
6.  **Submit**.
    *   *Result:* A comprehensive report including t-statistic, p-value, Cohen's d, group means, and a boxplot.

### Phase 3: One-Way ANOVA
**Goal:** Compare plant weight (`weight`) across 3 treatment groups (`group`).
1.  **Menu:** `Psychology / Social Science > Frequentist > One-Way ANOVA`
2.  **Dependent Variable:** `weight` (from `PlantGrowth`).
3.  **Factor:** `group` (from `PlantGrowth`).
4.  **Options:** Check "Effect Size", "Post-Hoc (Tukey)", and "Homogeneity".
5.  **Submit**.
    *   *Result:* ANOVA table with **Generalized Eta Squared (ges)**, Levene's test for homogeneity, Tukey HSD pairwise comparisons, and a boxplot.

### Phase 4: Correlation Matrix
**Goal:** Correlate MPG, Horsepower, and Weight.
1.  **Menu:** `Psychology / Social Science > Frequentist > Correlation Matrix`
2.  **Variables:** Select `mpg`, `hp`, and `wt` (from `mtcars`).
3.  **Options:** Check "Flag Significant Correlations" and "Plot Heatmap".
4.  **Submit**.
    *   *Result:* A correlation matrix with significance stars (`***`) and a visual heatmap.

### Phase 5: Reliability Analysis
**Goal:** Calculate internal consistency of a survey.
1.  **Menu:** `Psychology / Social Science > Frequentist > Reliability Analysis`
2.  **Items:** Select `Q1`, `Q2`, `Q3`, `Q4`, `Q5` (from `survey_data`).
3.  **Options:** Check "Item-Total Statistics".
4.  **Submit**.
    *   *Result:* **Cronbach's Alpha** for the scale, and a table showing how Alpha changes if specific items are dropped.

## Author
**Alfonso Cano**  
Benemérita Universidad Autónoma de Puebla  
License: GPL (>= 3)

---
*This plugin was developed with the assistance of **Gemini**, a large language model by Google.*
