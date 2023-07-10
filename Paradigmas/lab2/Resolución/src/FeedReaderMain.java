import parser.SubscriptionParser;
import parser.RssParser;
import subscription.SingleSubscription;
import subscription.Subscription;
import feed.Article;
import feed.Feed;
import namedEntity.NamedEntity;
import namedEntity.heuristic.*;

import java.util.ArrayList;
import java.util.List;

import httpRequest.httpRequester;

public class FeedReaderMain {

	private static void printHelp() {
		System.out.println("Please, call this program in correct way: FeedReader [-ne]");
	}

	public static void main(String[] args) {
		System.out.println("************* FeedReader version 1.0 *************");
		if (args.length == 0) {
			// Leo el archivo sub y lo guardo en s (Subscription)
			SubscriptionParser sub = new SubscriptionParser();
			Subscription s = sub.parse();
			List<SingleSubscription> sslist = s.getSubscriptionsList();
			
			for (int i = 0; i < sslist.size(); i++) {	//recorremos los single subscription

				SingleSubscription single = s.getSingleSubscription(i);
				String urlType = single.getUrlType();

				if (urlType.equals("rss")) {
					
					for (int j = 0; j < single.getUlrParamsSize(); j++) {	//recorremos los distintos feed del sitio
						System.out.println();
						System.out.println("------------ FEED = " + single.getFeedToRequest(j) + " ------------");
						System.out.println();
						
						httpRequester req = new httpRequester();
						String feed = req.getFeed(single.getFeedToRequest(j));
						RssParser rpar = new RssParser();
						Feed f = rpar.parse(feed);
						
						f.prettyPrint();
						System.out.println();
					}
				} else if (urlType.equals("reddit")) {
					System.out.println("No hay caso para reddit");
				}
			}
			/*
			 * -Leer el archivo de suscription por defecto; Llamar al httpRequester para
			 * obtenr el feed del servidor Llamar al Parser especifico para extrar los datos
			 * necesarios por la aplicacion Llamar al constructor de Feed LLamar al
			 * prettyPrint del Feed para ver los articulos del feed en forma legible y
			 * amigable para el usuario
			 */

		} else if (args.length == 1) {

			SubscriptionParser sub = new SubscriptionParser();
			Subscription s = sub.parse();

			List<SingleSubscription> sslist = s.getSubscriptionsList();

			for (int i = 0; i < sslist.size(); i++) {

				SingleSubscription single = s.getSingleSubscription(i);
				String urlType = single.getUrlType();

				if (urlType.equals("rss")) {

					for (int j = 0; j < single.getUlrParamsSize(); j++) {
						
						System.out.println();
						System.out.println("------------ FEED = " + single.getFeedToRequest(j) + " ------------");
						System.out.println();

						httpRequester req = new httpRequester();
						String feed = req.getFeed(single.getFeedToRequest(j));

						RssParser rpar = new RssParser();

						Feed f = rpar.parse(feed);
						
						int neTotales = 0;

						for (int k = 0; k < f.getArticleList().size(); k++) {

							Article art = f.getArticle(k);

							QuickHeuristic qh = new QuickHeuristic();

							art.computeNamedEntities(qh);
							
							neTotales += art.getNETotales();
							
							List<NamedEntity> neListArt = new ArrayList<NamedEntity>();
							neListArt = art.getEntityList();
							f.computeNamedEntities(neListArt);
							

							art.prettyPrintLNE();
							System.out.println();
						}
						System.out.println("ENTIDADES TOTALES: " + neTotales);
						f.prettyPrintLNE();

					}
				} else if (urlType.equals("reddit")) {
					System.out.println("No hay caso para reddit");
				}
			}

			/*
			 * Leer el archivo de suscription por defecto; Llamar al httpRequester para
			 * obtenr el feed del servidor Llamar al Parser especifico para extrar los datos
			 * necesarios por la aplicacion (Llamar al constructor de Feed)
			 * 
			 * Llamar a la heuristica para que compute las entidades nombradas de cada
			 * articulos del feed LLamar al prettyPrint de la tabla de entidades nombradas
			 * del feed.
			 */

		} else {
			printHelp();
		}
	}

}