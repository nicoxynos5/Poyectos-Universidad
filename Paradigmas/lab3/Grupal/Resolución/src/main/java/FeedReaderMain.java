import parser.SubscriptionParser;
import parser.RssParser;
import subscription.SingleSubscription;
import subscription.Subscription;
import feed.Article;
import feed.Feed;
import namedEntity.NamedEntity;
import namedEntity.heuristic.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;

import org.apache.log4j.PropertyConfigurator;

import java.util.Scanner;


//import org.apache.spark.api.java.JavaRDD;

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
					
					PropertyConfigurator.configure("src/main/resources/log4j.properties");
					SparkConf conf = new SparkConf().setAppName("SparkJavaExample").setMaster("local");
					try (JavaSparkContext sc = new JavaSparkContext(conf)) {
						for (int j = 0; j < single.getUlrParamsSize(); j++) {
							
							System.out.println();
							System.out.println("------------ FEED = " + single.getFeedToRequest(j) + " ------------");
							System.out.println();

							httpRequester req = new httpRequester();
							String feed = req.getFeed(single.getFeedToRequest(j));
							RssParser rpar = new RssParser();
							Feed f = rpar.parse(feed);

							JavaRDD<Article> articlesRDD = sc.parallelize(f.getArticleList());

							JavaRDD<Article> processedArticlesRDD = articlesRDD.map(article -> {
							    QuickHeuristic qh = new QuickHeuristic();
							    article.computeNamedEntities(qh);
							    return article;
							});

							int neTotales = processedArticlesRDD.map(Article::getNETotales).reduce(Integer::sum);

							JavaPairRDD<String, Integer> nePairRDD = processedArticlesRDD
							    .flatMapToPair(article -> {
							        List<Tuple2<String, Integer>> neList = new ArrayList<>();
							        for (NamedEntity namedEntity : article.getEntityList()) {
							            Tuple2<String, Integer> tuple = new Tuple2<>(namedEntity.getName(), namedEntity.getFrequency());
							            neList.add(tuple);
							        }
							        return neList.iterator();
							    })
							    .reduceByKey(Integer::sum);


							List<NamedEntity> neListArt = nePairRDD
								    .map(tuple -> new NamedEntity(tuple._1(), null, null, tuple._2()))
								    .collect();						
							
							f.computeNamedEntities(neListArt);

							processedArticlesRDD.foreach(Article::prettyPrintLNE);
							System.out.println();						
							System.out.println("ENTIDADES TOTALES: " + neTotales);
							f.prettyPrintLNE();
						}
						sc.stop();
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

		} else if (args.length == 2) {
            //String wordToSearch = args[1];

            SubscriptionParser sub = new SubscriptionParser();
            Subscription s = sub.parse();

            List<SingleSubscription> sslist = s.getSubscriptionsList();
            

            for (int i = 0; i < sslist.size(); i++) {
                SingleSubscription single = s.getSingleSubscription(i);
                String urlType = single.getUrlType();

                if (urlType.equals("rss")) {
                    PropertyConfigurator.configure("src/main/resources/log4j.properties");
                    SparkConf conf = new SparkConf().setAppName("SparkJavaExample").setMaster("local");
                    try (JavaSparkContext sc = new JavaSparkContext(conf)) {
                    	
                    	 // Lista para almacenar los índices invertidos de cada Feed
                    	List<Map<String, List<Article>>> invertedIndexes = new ArrayList<>();
                    	
                    	System.out.println();
                        for (int j = 0; j < single.getUlrParamsSize(); j++) {
                            System.out.println("HashMap creada con todas las palabras del FEED = " + single.getFeedToRequest(j));

                            httpRequester req = new httpRequester();
                            String feed = req.getFeed(single.getFeedToRequest(j));
                            RssParser rpar = new RssParser();
                            Feed f = rpar.parse(feed);

                            JavaRDD<Article> articlesRDD = sc.parallelize(f.getArticleList());

							// Paso 1: Crear pares clave-valor con las palabras y los artículos
							// correspondientes
							JavaPairRDD<String, Article> wordArticlePairsRDD = articlesRDD.flatMapToPair(article -> {

								List<Tuple2<String, Article>> wordArticlePairs = new ArrayList<>();

								// Dividir el titulo + texto de este artículo en palabras
								String[] words = article.getWords();

								// junto las palabras y su artículo
								for (String word : words) {
									Tuple2<String, Article> wordArticlePair = new Tuple2<>(word, article);
									wordArticlePairs.add(wordArticlePair);
								}
								return wordArticlePairs.iterator();
							});

							// Paso 2: Agrupar los artículos por palabra
							JavaPairRDD<String, Iterable<Article>> groupedArticlesRDD = wordArticlePairsRDD
									.groupByKey();
									
							Map<String, List<Article>> invertedIndex = new HashMap<>();
							// Paso 3: Convertir el RDD en un diccionario / Iteramos sobre palabra y su
							// lista de articulos
							invertedIndex = groupedArticlesRDD.mapToPair(tuple -> {

								//palabra
								String actualWord = tuple._1;
								
								// lista de articulos que tiene esa palabra
								List<Article> articles = new ArrayList<>();
								for (Article article : tuple._2) {
									articles.add(article);
								}
								
								//ordenamos la lista de articulos según quien tiene mas veces la palabra
								articles.sort((a, b) -> Integer.compare(b.countWordOccurrences(actualWord),
										a.countWordOccurrences(actualWord)));

								// al diccionario le guardo esta nueva tupla
								return new Tuple2<>(actualWord, articles);
							}).collectAsMap();

							
							 // Agregar el índice invertido a la lista
                            invertedIndexes.add(invertedIndex);
                            
                            
                        }
                        Scanner scanner = new Scanner(System.in);
                        String wordToSearch;
                        while (true) {
                        	System.out.print("Ingrese una palabra para buscar en los artículos (o 'salir' para terminar): ");
                        	wordToSearch = scanner.nextLine();
                        	
                        	if (wordToSearch.equalsIgnoreCase("salir")) {
                        		break;
                        	}
                        	// realiza la busqueda en la hashMap de cada feed e imprime
                        	// los articulos de mayor a menor.
                        	single.searchWord(invertedIndexes, wordToSearch);
                        }
                        System.out.println("Fin del programa.");
                        scanner.close();
                        sc.stop();
                    }
                } else if (urlType.equals("reddit")) {
                    System.out.println("No hay caso para reddit");
                }
            }
        } else {
            printHelp();
        }
    }
}
