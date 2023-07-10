package feed;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import categoryTopic.LugarCultura;
import categoryTopic.LugarPolitica;
import categoryTopic.PersonaOtros;
import categoryTopic.PersonaPolitica;
import namedEntity.*;

/*Esta clase modela la lista de articulos de un determinado feed*/
public class Feed {
	String siteName;
	List<Article> articleList;
	List<NamedEntity> neListFeed = new ArrayList<NamedEntity>();
	int perTotales;
	int lugTotales;
	int orgTotales;
	
	public Feed(String siteName) {
		super();
		this.siteName = siteName;
		this.articleList = new ArrayList<Article>();
		this.perTotales = 0;
		this.lugTotales = 0;
		this.orgTotales = 0;
	}
	
	public String getSiteName(){
		return siteName;
	}
	
	public void setSiteName(String siteName){
		this.siteName = siteName;
	}
	
	public List<Article> getArticleList(){
		return articleList;
	}
	
	public void setArticleList(List<Article> articleList){
		this.articleList = articleList;
	}
	
	public void addArticle(Article a){
		this.getArticleList().add(a);
	}
	
	public Article getArticle(int i){
		return this.getArticleList().get(i);
	}
	
	public int getNumberOfArticles(){
		return this.getArticleList().size();
	}
	
	@Override
	public String toString(){
		return "Feed [siteName=" + getSiteName() + ", articleList=" + getArticleList() + "]";
	}
	
	public boolean getNamedEntity(String ne) {
		for (NamedEntity n : neListFeed) {
			if (n.getName().compareTo(ne) == 0) {
				return true;
			}
		}
		return false;
	}
	
	public int getCountNamedEntity(String ne) {
		int countNE = 0;
		for (NamedEntity n : neListFeed) {
			if (n.getName().compareTo(ne) == 0) {
				countNE++;
			}
		}
		return countNE;
	}

	public void computeNamedEntities(List<NamedEntity> neListArt) {
		
		for(int i=0; i<neListArt.size(); i++) {

			NamedEntity ne = neListArt.get(i);
			
			boolean esta = this.getNamedEntity(ne.getName());

			
			if (!esta) { // nunca vimos esta entidad (1)

				String category = ne.getCategory(); // agarro la categoria y creo un objeto con esa categoria

				if (category == "Persona") {
					Persona newEntity = new Persona(ne.getName(), category, null, 1);
					this.neListFeed.add(newEntity);
					this.perTotales++;
				} else if (category == "Organizacion") {
					Organizacion newEntity = new Organizacion(ne.getName(), category, null, 1);
					this.neListFeed.add(newEntity);
					this.orgTotales++;
				} else if (category == "Lugar"){
					Lugar newEntity = new Lugar(ne.getName(), category, null, 1);
					this.neListFeed.add(newEntity);
					this.lugTotales++;
				} else {// no esta en el diccionario (2)
					this.neListFeed.add(new NamedEntity(ne.getName(), null, null, ne.getFrequency())); // si no esta en el dicc creamos
																					// una ne normal sin categroia
				}
			} else { // ya habiamos visto esta entidad, entonces incrementamos (1)
				ne.incFrequency(ne.getFrequency());
			}
		}
	}
	
	public void prettyPrintLNE() {
		
		System.out.println();
		
		System.out.println("PERSONAS: " + this.perTotales);
		System.out.println("LUGARES: " + this.lugTotales);
		System.out.println("ORGANIZACIONES: " + this.orgTotales);
		
		System.out.println();
		System.out.println();
		
		for (int i = 0; i < neListFeed.size(); i++) {

			NamedEntity ne = neListFeed.get(i);
			
			ne.prettyPrint();
			
			if (ne.getCategory() != null) {

				System.out.println(
						"---> Categoría: " + ne.getCategory().toUpperCase());

			}

		}

		System.out.println(
				"**********************************************************************************************");
		System.out.println();
	}


	

	public void prettyPrint(){
		for (Article a: this.getArticleList()){
			a.prettyPrint();
		}
		
	}
	
	public static void main(String[] args) {
		  Article a1 = new Article("This Historically Black University Created Its Own Tech Intern Pipeline",
			  "A new program at Bowie State connects computing students directly with companies, bypassing an often harsh Silicon Valley vetting process",
			  new Date(),
			  "https://www.nytimes.com/2023/04/05/technology/bowie-hbcu-tech-intern-pipeline.html"
			  );
		 
		  Article a2 = new Article("This Historically Black University Created Its Own Tech Intern Pipeline",
				  "A new program at Bowie State connects computing students directly with companies, bypassing an often harsh Silicon Valley vetting process",
				  new Date(),
				  "https://www.nytimes.com/2023/04/05/technology/bowie-hbcu-tech-intern-pipeline.html"
				  );
		  
		  Article a3 = new Article("This Historically Black University Created Its Own Tech Intern Pipeline",
				  "A new program at Bowie State connects computing students directly with companies, bypassing an often harsh Silicon Valley vetting process",
				  new Date(),
				  "https://www.nytimes.com/2023/04/05/technology/bowie-hbcu-tech-intern-pipeline.html"
				  );
		  
		  Feed f = new Feed("nytimes");
		  f.addArticle(a1);
		  f.addArticle(a2);
		  f.addArticle(a3);

		  f.prettyPrint();
		  
	}
	
}
