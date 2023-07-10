package parser;

import java.io.FileNotFoundException;

import subscription.Subscription;
import subscription.SingleSubscription;

import org.json.*;
import java.io.FileReader;
import java.util.Iterator;
//import java.util.ArrayList;
//import java.util.List;


/*
 * Esta clase implementa el parser del  archivo de suscripcion (json)
 * Leer https://www.w3docs.com/snippets/java/how-to-parse-json-in-java.html
 * */

public class SubscriptionParser {
	
	public Subscription parse() {
		String filePath = "config/subscriptions.json";
		FileReader reader;
		Subscription sub = new Subscription(null);
		try {
			reader = new FileReader(filePath);
			JSONArray list = new JSONArray(new JSONTokener(reader));
			
			for(int i=0; i<list.length(); i++) {
				JSONObject obj = list.getJSONObject(i);
				
				String url = obj.getString("url");
				
				String urlType = obj.getString("urlType");
				
				JSONArray urlParameters = (JSONArray) obj.get("urlParams");
			
				SingleSubscription single = new SingleSubscription(url, null, urlType);
				
				//https://www.tutorialspoint.com/how-to-read-parse-json-array-using-java
				Iterator<Object> iterator = urlParameters.iterator();
				while (iterator.hasNext()) {
					single.setUlrParams((String) iterator.next());
				}

				sub.addSingleSubscription(single);
			}
		
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		}
		return sub;
	}
	
	public static void main(String[] args) {
		SubscriptionParser p = new SubscriptionParser();
		Subscription sub = p.parse();
		sub.prettyPrint();
	}
}	