elongateCode <- function(type){
  
  if(type == "clothing" || type == "body"){
    regex <- paste0("other.", type)
  } else {
    regex <- paste0("\\b", type, "\\b.*?gender\\b")
  }
  bonusColumn <- colnames(select(banned, matches(regex)))
  
  new <- banned %>%
    # First sort out any additional items that we added to our bonus column
    separate_rows_(bonusColumn, sep = ",") %>%
    separate(bonusColumn, into = c("item", "prohibited"), sep = ":") %>%
    mutate(type = type) %>%
    select(c(1:6), c(item, prohibited, type)) %>%
    filter(!is.na(prohibited)) %>%
    mutate(prohibited = ifelse(prohibited == "NA", "none", prohibited))

  new2 <- banned %>%
    select(-contains("any.other")) %>%
    gather(key = item, value = prohibited, colnames(select(., contains(!!type)))) %>%
    filter(!is.na(prohibited)) %>%
    mutate(item = gsub("(.*\\.{3})", "", item),
           item = gsub("\\.", " ", item),
           item = trimws(item)) %>%
    mutate(type = type) %>%
    select(c(1:6), c(item:type))

  combined <- rbind(new, new2)
}


findBanned <- function(data){
  clothingTypes <- c("accessories", "shirt", "skirt.dress", "pants", "shorts", "undergarment", "footwear", "headwear", "grooming", "body", "clothing")
  
  # setting as a variable accessible inside the parent scope
  banned <<- data %>% 
    select(-contains("sanctions"), - contains("shirt.straps"), -contains("length.limit")) 
  
  longDressCode <- map_dfr(clothingTypes, elongateCode)
}

findBannedByItem <- function(data){
  
  bannedItems <- data %>% 
    mutate(item = trimws(item)) %>% 
    group_by(type, item) %>% 
    count(item, sort = TRUE)
}

