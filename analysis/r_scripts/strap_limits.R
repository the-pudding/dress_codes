findStraps <- function(data){
  data %>% 
    select(c("School.Name", "School.State.Abbreviation"), contains("shirt.straps")) %>% 
    rename(limits = !!names(.[3])) %>% 
    filter(limits != "") %>% 
    # Separate comma delimited list of items
    separate(limits, into = c("limits", "inches"), sep = ",") %>% 
    mutate(limits = trimws(limits)) %>% 
    distinct("School.Name") %>% 
    summarise(n = n()) %>% 
    mutate(item = "narrow straps",
           type = "shirt")
}