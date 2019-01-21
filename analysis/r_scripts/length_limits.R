findLength <- function(data){
  data %>% select(c("School.Name", "School.State.Abbreviation"), contains("length.limit")) %>% 
    rename(limits = !!names(.[3]), length = !!names(.[4])) %>% 
    filter(limits != "") %>% 
    # Separate comma delimited list of items
    separate_rows(limits, sep = ",") %>% 
    mutate(limits = trimws(limits)) 
}

findLengthByItem <- function(lengthData){
  lengthData %>% 
    count(limits, sort = TRUE) %>% 
    mutate(type = "length",
           limits = paste0("short ", limits)) %>% 
    rename(item = limits)
}