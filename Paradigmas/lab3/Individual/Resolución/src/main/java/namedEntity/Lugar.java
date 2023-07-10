package namedEntity;

public class Lugar extends NamedEntity{
	public Lugar(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
}

class Pais extends Lugar{
	public Pais(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	public String poblacion;
	public String lengua_oficial;
}

class Ciudad extends Lugar{
	public Ciudad(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	public String pais;
	public String capita;
	public String poblacion;
}
class Direccion extends Lugar{
	public Direccion(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	public String ciudad;
}