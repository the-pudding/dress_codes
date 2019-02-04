# Importing libraries

# For file structures
library(here)

# Importing Data
# Assuming that banned_items.csv has been downloaded and kept in a folder called `raw_data` within the current working directory.
# Download banned_items.csv from https://github.com/the-pudding/data/tree/master/dress_codes/banned_items.csv
bannedItems <- read.csv(here::here("raw_data", "banned_items.csv"), stringsAsFactors = FALSE, header = TRUE)


