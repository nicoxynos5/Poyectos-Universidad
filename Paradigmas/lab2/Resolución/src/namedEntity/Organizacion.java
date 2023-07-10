package namedEntity;

public class Organizacion extends NamedEntity{
	public Organizacion(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}

	public String fcanonica;
	public int nro_miembros;
	public String tipo_org;
}