clean_items <- function(data){
  googledrive::drive_download("manualCorrections", path = here::here("raw_data", "collected", "manualCorrections.csv"), type = "csv", overwrite = TRUE)
  
  manual <- read.csv(here::here("raw_data", "collected", "manualCorrections.csv"), stringsAsFactors = FALSE, header = TRUE, na.strings = c("", " "))
  
  bannedManual <- data %>% 
    ungroup() %>% 
    mutate(item = trimws(item)) %>% 
    left_join(manual) %>% 
    mutate(item = ifelse(!is.na(itemCorrect), itemCorrect, item),
           type = ifelse(!is.na(catCorrect), catCorrect, type)) %>%
    group_by(type, item) %>% 
    summarise(n = sum(n)) %>% 
    arrange(desc(n))
 }