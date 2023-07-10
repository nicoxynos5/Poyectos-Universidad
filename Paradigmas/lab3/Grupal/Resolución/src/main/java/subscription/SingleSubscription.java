package subscription;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import feed.Article;


/*Esta clse abstrae el contenido de una sola suscripcion que ocurre en lista de suscripciones que figuran en el archivo de suscrpcion(json) */
public class SingleSubscription {
	
	private String url;
	private List<String> ulrParams;
	private String urlType;
	
	
	public SingleSubscription(String url, List<String> ulrParams, String urlType) {
		super();
		this.url = url;
		this.ulrParams = new ArrayList<String>() ;
		this.urlType = urlType;
	}

	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public List<String> getUlrParams() {
		return ulrParams;
	}
	public String getUlrParams(int i) {
		return this.ulrParams.get(i);
	}
	public void setUlrParams(String urlParam) {
		this.ulrParams.add(urlParam);
	}
	public int getUlrParamsSize() {
		return ulrParams.size();
	}
	public String getUrlType() {
		return urlType;
	}
	public void setUrlType(String urlType) {
		this.urlType = urlType;
	} 
	
	@Override
	public String toString() {
		return "{url=" + getUrl() + ", ulrParams=" + getUlrParams().toString() + ", urlType=" + getUrlType() + "}";
	}
	
	public void prettyPrint(){
		System.out.println(this.toString());
	}
	
	
	public String getFeedToRequest(int i){
		return this.getUrl().replace("%s",this.getUlrParams(i));
	}
	
	public static void main(String[] args) {
		System.out.println("SingleSubscriptionClass");
		SingleSubscription s = new SingleSubscription("https://rss.nytimes.com/services/xml/rss/nyt/%s.xml", null, "rss");
		s.setUlrParams("Business");
		s.setUlrParams("Technology");
		System.out.println(s.getFeedToRequest(0));
		s.prettyPrint();
	}
	
	public void searchWord(List<Map<String, List<Article>>> invertedIndexes, String wordToSearch) {
		for (int j = 0; j < this.getUlrParamsSize(); j++) {
            System.out.println();
            System.out.println("------------ FEED = " + this.getFeedToRequest(j) + " ------------");
            System.out.println();
            
            Map<String, List<Article>> hashFeed = invertedIndexes.get(j); 
        	List<Article> articles = hashFeed.get(wordToSearch);
        	if(articles != null) {
        		
        		System.out.println("Artículos que contienen la palabra '" + wordToSearch + "':");
        		for (Article article : articles) {
        			System.out.println(article.getTitle());
        		}
        		System.out.println();
        	}else {
        		System.out.println("No se encontraton artículos");
        		System.out.println();
        	}
    	}
		
	}
		
}
