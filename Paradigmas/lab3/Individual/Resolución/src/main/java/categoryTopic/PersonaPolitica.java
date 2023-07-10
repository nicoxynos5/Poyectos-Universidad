package categoryTopic;
import interfaceTopics.*;
import namedEntity.*;

public class PersonaPolitica extends Persona implements Politica{
	public PersonaPolitica(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
}
