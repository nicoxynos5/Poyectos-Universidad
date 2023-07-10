package namedEntity;

public class Persona extends NamedEntity{
	public int ID;
	
	public Persona(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}

}

class Apellido extends Persona{
	public Apellido(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	public String fcanonica;
	public String origen;
}
class Nombre extends Persona{
	public Nombre(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	public String fcanonica;
	public String origen;
	public String falternativas;
}

class Titulo extends Persona{
	public Titulo(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
	public String fcanonica;
	public String profesional;
}