package feed;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import namedEntity.NamedEntity;
import namedEntity.heuristic.Heuristic;
//import namedEntity.*;
import categoryTopic.*;

/*Esta clase modela el contenido de un articulo (ie, un item en el caso del rss feed) */

import java.io.Serializable;

public class Article implements Serializable {
	private String title;
	private String text;
	private Date publicationDate;
	private String link;
	private int neTotales;

	private List<NamedEntity> namedEntityList = new ArrayList<NamedEntity>();

	public Article(String title, String text, Date publicationDate, String link) {
		super();
		this.title = title;
		this.text = text;
		this.publicationDate = publicationDate;
		this.link = link;
		this.neTotales = 0;
	}

	public int getNETotales() {
		return this.neTotales;
	}
	
	public List<NamedEntity> getEntityList() {
		return this.namedEntityList;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public void setPublicationDate(Date publicationDate) {
		this.publicationDate = publicationDate;
	}

	public Date getPublicationDate() {
		return publicationDate;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	@Override
	public String toString() {
		return "Article [title=" + title + ", text=" + text + ", publicationDate=" + publicationDate + ", link=" + link
				+ "]";
	}

	public NamedEntity getNamedEntity(String namedEntity) {
		for (NamedEntity n : namedEntityList) {
			if (n.getName().compareTo(namedEntity) == 0) {
				return n;
			}
		}
		return null;
	}
	
	
	public String[] getWords() {
		// título y texto del artículo
		String text = this.getTitle() + " " + this.getText();
		// Dividir el texto de este artículo en palabras
		String[] words = text.split("\\s+");
		return words;
	}
	
    public int countWordOccurrences(String word) {
        String[] words = this.getWords();
        int count = 0;
        for (String w : words) {
            if (w.equalsIgnoreCase(word)) {
                count++;
            }
        }
        return count;
    }

	public void computeNamedEntities(Heuristic h) {
		String text = this.getTitle() + " " + this.getText();

		String charsToRemove = ".,;:()'!?\n";
		for (char c : charsToRemove.toCharArray()) {
			text = text.replace(String.valueOf(c), "");
		}

		for (String s : text.split(" ")) {

			if (h.isEntity(s)) { // es una entidad?

				NamedEntity ne = this.getNamedEntity(s);
				this.neTotales++;

				if (ne == null) { // nunca vimos esta entidad (1)

					if (h.isInCategoryMap(s)) { // esta en diccionario? (2)

						String category = h.getCategory(s); // agarro la categoria y creo un objeto con esa categoria
						String topic = h.getTopic(s);

						if (category == "Persona" && topic == "Politica") {
							PersonaPolitica newEntity = new PersonaPolitica(s, category, topic, 1);
							this.namedEntityList.add(newEntity);
						} else if (category == "Organizacion" && topic == "Cultura") {
							PersonaPolitica newEntity = new PersonaPolitica(s, category, topic, 1);
							this.namedEntityList.add(newEntity);
						} else if (category == "Lugar" && topic == "Politica") {
							LugarPolitica newEntity = new LugarPolitica(s, category, topic, 1);
							this.namedEntityList.add(newEntity);
						} else if (category == "Lugar" && topic == "Cultura") {
							LugarCultura newEntity = new LugarCultura(s, category, topic, 1);
							this.namedEntityList.add(newEntity);
						} else if (category == "Persona" && topic == "Otros") {
							PersonaOtros newEntity = new PersonaOtros(s, category, topic, 1);
							this.namedEntityList.add(newEntity);
						}

					} else {// no esta en el diccionario (2)
						this.namedEntityList.add(new NamedEntity(s, null, null, 1)); // si no esta en el dicc creamos
																						// una ne normal sin categroia
					}
				} else { // ya habiamos visto esta entidad, entonces incrementamos (1)
					ne.incFrequency();
				}
			}
		}
	}

	public void prettyPrint() {
		System.out.println(
				"**********************************************************************************************");
		System.out.println("Title: " + this.getTitle());
		System.out.println("Publication Date: " + this.getPublicationDate());
		System.out.println("Link: " + this.getLink());
		System.out.println("Text: " + this.getText());
		System.out.println(
				"**********************************************************************************************");

	}

	public void prettyPrintLNE() {
		System.out.println(
				"**********************************************************************************************");
		System.out.println("Entidades nombradas encontradas en el artículo: " + this.title);
		System.out.println();
		for (int i = 0; i < namedEntityList.size(); i++) {

			NamedEntity ne = namedEntityList.get(i);
			ne.prettyPrint();

			if (ne.getCategory() != null) {

				System.out.println(
						"---> Categoría: " + ne.getCategory().toUpperCase() + "  Tema: " + ne.getTopic().toUpperCase());

			}
			System.out.println();
		}

		System.out.println(
				"**********************************************************************************************");
		System.out.println();
	}

	public static void main(String[] args) {
		Article a = new Article("This Historically Black University Created Its Own Tech Intern Pipeline",
				"A new program at Bowie State connects computing students directly with companies, bypassing an often harsh Silicon Valley vetting process",
				new Date(), "https://www.nytimes.com/2023/04/05/technology/bowie-hbcu-tech-intern-pipeline.html");

		a.prettyPrint();
	}

}
