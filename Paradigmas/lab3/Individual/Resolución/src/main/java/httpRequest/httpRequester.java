package httpRequest;

import java.io.Reader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.InputStreamReader;
import java.io.BufferedReader;

/* Esta clase se encarga de realizar efectivamente el pedido de feed al servidor de noticias
 * Leer sobre como hacer una http request en java
 * https://www.baeldung.com/java-http-request
 * */

public class httpRequester {
	
	public String getFeed(String urlFeed){
		//objeto para almacenar cadena de caracteres y luego poder manipularlo facilmente
		StringBuilder result = new StringBuilder();
		
		try {
			// un puntero a un "recurso" en la World Wide Web.
			URL url= new URL(urlFeed);
			//creamos la conexion de tipo GET
			HttpURLConnection conexion = (HttpURLConnection)url.openConnection();
			conexion.setRequestMethod("GET");
			//getInputStream() devuelve un flujo de entrada para leer bytes de este socket
			//InputStreamReader() lee bytes y los decodifica en caracteres
			Reader r = new InputStreamReader(conexion.getInputStream());
			//leer el texto de un flujo de entrada basado en caracteres.
			//Se puede usar para leer datos línea por línea mediante el método readLine()
			BufferedReader br = new BufferedReader(r);
			String linea;
			while((linea = br.readLine()) != null) {
				result.append(linea);
				result.append("\n");
			}
			br.close();
			conexion.disconnect();
		} catch (IOException e) {
			System.err.println("Url inválido: " + e.getMessage());
			System.exit(1);
		}
		//retorna result, pero como cadena, no como StringBuilder
		return result.toString();
	}
	
	public static void main(String[] args) {
		httpRequester obj = new httpRequester();
		String url = "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml";
		String feed = null;
		feed = obj.getFeed(url);
		System.out.println(feed);
		
	}
}
