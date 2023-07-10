package parser;

import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.*;
import org.xml.sax.*;

import feed.Article;
import feed.Feed;
import httpRequest.httpRequester;

import java.text.SimpleDateFormat;
import java.util.Date;

/* Esta clase implementa el parser de feed de tipo rss (xml)
 * https://www.tutorialspoint.com/java_xml/java_dom_parse_document.htm 
 * */

//https://mkyong.com/java/how-to-read-xml-file-in-java-dom-parser/

public class RssParser{

	public Feed parse(String xml) {

		try {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();

			// https://stackoverflow.com/questions/562160/in-java-how-do-i-parse-xml-as-a-string-instead-of-a-file
			InputSource is = new InputSource(new StringReader(xml));
			Document doc = builder.parse(is);

			// http://stackoverflow.com/questions/13786607/normalization-in-dom-parsing-with-java-how-does-it-work
			doc.getDocumentElement().normalize();

			NodeList list = doc.getElementsByTagName("item"); // tenog una lsita con todos los elementos q tienen esa
																// tag

			Feed f = new Feed("nytimes");

			for (int i = 0; i < list.getLength(); i++) {

				Node node = list.item(i); // agarro el primer elemento de la lista

				if (node.getNodeType() == Node.ELEMENT_NODE) {

					Element element = (Element) node;

					String title = element.getElementsByTagName("title").item(0).getTextContent();
					String description = element.getElementsByTagName("description").item(0).getTextContent();
					String pubDate = element.getElementsByTagName("pubDate").item(0).getTextContent();
					String link = element.getElementsByTagName("link").item(0).getTextContent();

					// https://www.javatpoint.com/java-string-to-date
					SimpleDateFormat formatter = new SimpleDateFormat("E, dd MMM yyyy HH:mm:ss Z");
					Date date = formatter.parse(pubDate);

					Article art = new feed.Article(title, description, date, link);
					f.addArticle(art);

				}
			}

			return f;

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	public static void main(String[] args) {
		httpRequester conex = new httpRequester();
		String result = conex.getFeed("https://rss.nytimes.com/services/xml/rss/nyt/Business.xml");

		RssParser bonito = new RssParser();
		Feed fe = bonito.parse(result);
		fe.prettyPrint();
	}
}
