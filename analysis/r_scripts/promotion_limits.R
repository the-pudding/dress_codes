findPromotions <- function(data){
  promotion <- data %>% 
    select(c("School.Name", "School.State.Abbreviation"), contains("promotion")) %>% 
    rename(item = !!names(.[3])) %>% 
    separate_rows(item, sep = ", ") %>% 
    mutate(item = trimws(item)) %>% 
    count(item, sort = TRUE) %>% 
    mutate(type = 'promotion')
}