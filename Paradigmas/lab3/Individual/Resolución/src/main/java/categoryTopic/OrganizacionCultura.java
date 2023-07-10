package categoryTopic;
import interfaceTopics.*;
import namedEntity.*;

public class OrganizacionCultura extends Organizacion implements Cultura{
	public OrganizacionCultura(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
}
