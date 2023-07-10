package namedEntity.heuristic;
//import namedEntity.*;
import java.util.Map;
//import java.util.HashMap;

public abstract class Heuristic {

	private static Map<String, String> categoryMap = Map.ofEntries(
			Map.entry("Trump", "Persona"),
			Map.entry("Biden", "Persona"),
			Map.entry("Tucker", "Persona"),
			Map.entry("Carlson", "Persona"),
			Map.entry("Musk", "Persona"),
			Map.entry("China", "Lugar"),
			Map.entry("US", "Lugar"),
			Map.entry("UK", "Lugar"),
			Map.entry("Slovenia", "Lugar"),
			Map.entry("Twitter", "Organizacion"),
			Map.entry("Google", "Organizacion"),
			Map.entry("Hollywood", "Lugar"),
			Map.entry("Disney", "Organizacion")
			);
	
	private static Map<String, String> topicMap = Map.ofEntries(
			Map.entry("Trump", "Politica"),
			Map.entry("Biden", "Politica"),
			Map.entry("Tucker", "Cultura"),
			Map.entry("Carlson", "Cultura"),
			Map.entry("Musk", "Otros"),
			Map.entry("China", "Politica"),
			Map.entry("US", "Politica"),
			Map.entry("UK", "Politica"),
			Map.entry("Slovenia", "Cultura"),
			Map.entry("Twitter", "Cultura"),
			Map.entry("Google", "Cultura"),
			Map.entry("Hollywood", "Cultura"),
			Map.entry("Disney", "Cultura")
			);
	
	
	public String getCategory(String entity){
		return categoryMap.get(entity);
	}
	
	public String getTopic(String entity){
		return topicMap.get(entity);
	}
	
	public boolean isInCategoryMap(String entity) {
		return categoryMap.containsKey(entity);
	}
	
	public boolean isInTopicMap(String entity) {
		return topicMap.containsKey(entity);
	}	
	
	
	public abstract boolean isEntity(String word);
		
}
