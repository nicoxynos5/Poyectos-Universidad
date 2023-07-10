package categoryTopic;
import interfaceTopics.*;
import namedEntity.*;

public class PersonaOtros extends Persona implements Otros{
	public PersonaOtros(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
}
