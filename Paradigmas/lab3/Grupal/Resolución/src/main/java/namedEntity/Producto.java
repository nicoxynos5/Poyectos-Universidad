package namedEntity;

public class Producto extends NamedEntity{
	public Producto(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	
	public String comercial;
	public String productor;
}